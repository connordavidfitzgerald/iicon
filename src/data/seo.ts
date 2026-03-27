import metaImage from '@images/meta.png';

export const defaultSeo: Seo = {
    title: 'IICON Creative Strategies',
    description:
        'IICON Creative Strategies is a specialist branding studio that combines strategic thinking with the science of human connection.',
    social: {
        facebook: {
            title: 'IICON Creative Strategies',
            image: {
                url: metaImage.src
            },
            description:
                'IICON Creative Strategies is a specialist branding studio that combines strategic thinking with the science of human connection.'
        },
        twitter: {
            title: 'IICON Creative Strategies',
            image: {
                url: metaImage.src
            },
            description:
                'IICON Creative Strategies is a specialist branding studio that combines strategic thinking with the science of human connection.'
        }
    },
    advanced: {
        robots: ['index', 'follow'],
        canonical: 'https://iicon.ca'
    }
};
