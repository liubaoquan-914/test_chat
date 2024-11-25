import { OpenAIClient, AzureKeyCredential } from '@azure/openai';

const client = new OpenAIClient(
	'https://<resource name>.openai.azure.com/',
	new AzureKeyCredential('<Azure API key>')
);
