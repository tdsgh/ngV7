export interface IAppConfig {
    appConfig: {
        viewTabs: Array<string>;
        views: {
            loading: {
                viewToTransit: string;
            },
            rnr: {
                [x: string]: any;
            }
        }
    };
    appSettings: {
        currency: string;
        features: {
            app: {
                buyBox: string;
                map: string;
                enableQA: boolean;
                ftp: string
            }
        }

    };
    refResources: Array<string>;
    api: {
        srvUrl: string;
		server_matching: string;
		server_download: string;
		server_pdf: string;
		server_image: string;
    }
}