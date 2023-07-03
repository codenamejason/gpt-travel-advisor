import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, CreateCompletionResponseChoicesInner, OpenAIApi } from "openai";

const configuration = new Configuration({
    organization: "org-VYP4dsBVeMphbNLt3fReuuhY",
    apiKey: process.env.GPT_API_KEY,
});

const openai = new OpenAIApi(configuration);

type ContractorData = {
    contractors: any;
}

type Error = {
    message: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ContractorData | Error>
) {
    let category = "general contractor",
        city = "jacksonville, Florida";
    if (req.body) {
        let body = JSON.parse(req.body);
        category = body.category.name;
        city = body.city;
    }
    let basePrompt = `what are the best contractors in ${city} for ${category}?`;
    const completionData = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: basePrompt,
        temperature: 1,
        max_tokens: 550,
    });

    console.log("Contractors: ", { completionData: completionData.data.choices });
    let contractors: CreateCompletionResponseChoicesInner[] = completionData.data.choices ?? [];
    console.log({ contractors });

    let returnData = contractors[0].text?.split(",");
    returnData = returnData?.map((i) => i.trim());

    res.status(200).json({
        contractors: returnData,
    });
}