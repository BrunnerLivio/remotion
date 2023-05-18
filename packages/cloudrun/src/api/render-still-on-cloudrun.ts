import type {ChromiumOptions, StillImageFormat} from '@remotion/renderer';
import got from 'got';
import {validatePrivacy} from '../shared/validate-privacy';
import {validateServeUrl} from '../shared/validate-serveurl';
import {getAuthClientForUrl} from './helpers/get-auth-client-for-url';
import {getCloudrunEndpoint} from './helpers/get-cloudrun-endpoint';

export type RenderStillOnCloudrunInput = {
	authenticatedRequest: boolean;
	cloudRunUrl?: string;
	serviceName?: string;
	region?: string;
	serveUrl: string;
	composition: string;
	inputProps?: unknown;
	outputBucket: string;
	privacy?: string;
	outputFile?: string;
	imageFormat: StillImageFormat;
	envVariables?: Record<string, string>;
	frame?: number;
	jpegQuality?: number;
	chromiumOptions?: ChromiumOptions;
	scale?: number;
	forceWidth?: number | null;
	forceHeight?: number | null;
};

export type RenderStillOnCloudrunOutput = {
	publicUrl: string;
	cloudStorageUri: string;
	size: string;
	bucketName: string;
	renderId: string;
	status: string;
	privacy: string;
	errMessage: string;
	error: any;
};

/**
 * @description Triggers a render on a GCP Cloud Run service given a composition and a Cloud Run URL.
 * @see [Documentation](https://remotion.dev/docs/cloudrun/renderStillOnCloudrun)
 * @param params.authenticatedRequest If this is an authenticated request, .env file will be checked for GCP credentials
 * @param params.cloudRunUrl The url of the Cloud Run service that should be used
 * @param params.serviceName The name of the Cloud Run service that should be used
 * @param params.serveUrl The URL of the deployed project
 * @param params.composition The ID of the composition which should be rendered.
 * @param params.inputProps The input props that should be passed to the composition.
 * @param params.outputBucket The name of the GCP Storage Bucket that will store the rendered media output.
 * @param params.outputFolderPath The folder path of the GCP Storage Bucket that will store the rendered media output.
 * @param params.outName The file name of the rendered media output.
 * @returns {Promise<RenderStillOnCloudrunOutput>} See documentation for detailed structure
 */

export const renderStillOnCloudrun = async ({
	authenticatedRequest,
	cloudRunUrl,
	serviceName,
	region,
	serveUrl,
	composition,
	inputProps,
	outputBucket,
	privacy,
	outputFile,
	imageFormat,
	envVariables,
	frame,
	jpegQuality,
	chromiumOptions,
	scale,
	forceWidth,
	forceHeight,
}: RenderStillOnCloudrunInput): Promise<RenderStillOnCloudrunOutput> => {
	validateServeUrl(serveUrl);
	if (privacy) validatePrivacy(privacy);

	const cloudRunEndpoint = await getCloudrunEndpoint({
		cloudRunUrl,
		serviceName,
		region,
	});

	const data = {
		composition,
		serveUrl,
		inputProps,
		outputBucket,
		outputFile,
		privacy,
		imageFormat,
		envVariables,
		jpegQuality,
		chromiumOptions,
		scale,
		forceWidth,
		forceHeight,
		frame: frame ?? 0,
		type: 'still',
	};

	if (authenticatedRequest) {
		const client = await getAuthClientForUrl(cloudRunEndpoint);

		const authenticatedResponse = await client.request({
			url: cloudRunUrl,
			method: 'POST',
			data,
		});
		return authenticatedResponse.data as RenderStillOnCloudrunOutput;
	}

	const response: RenderStillOnCloudrunOutput = await got
		.post(cloudRunEndpoint, {json: data})
		.json();
	return response;
};