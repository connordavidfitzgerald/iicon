import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
    api: {
        projectId: 'x5h383xf',
        dataset: 'production',
    },
    deployment: {
        /**
         * Enable auto-updates for studios.
         * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
         */
        autoUpdates: true,
    },
})
