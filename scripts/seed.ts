/**
 * One-off migration: lifts the content that used to be hard-coded in the .astro
 * pages into Sanity, and uploads the images from src/assets/images.
 *
 * Safe to re-run — images dedupe on their hash, singletons are replaced, and
 * collection documents are matched on a stable field before being created.
 *
 *   SANITY_WRITE_TOKEN=... npm run seed
 */
import { createClient } from '@sanity/client';
import { createReadStream } from 'node:fs';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES = path.resolve(__dirname, '../src/assets/images');

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) throw new Error('SANITY_WRITE_TOKEN is required.');

const client = createClient({
    projectId: 'rkp7m27a',
    dataset: 'production',
    apiVersion: '2026-08-05',
    token,
    useCdn: false
});

// ── Helpers ──────────────────────────────────────────────────────────────────

const assetCache = new Map<string, string>();

/** Upload an image and return a `figure` value ready to drop into a document. */
async function figure(filename: string, alt: string) {
    let assetId = assetCache.get(filename);

    if (!assetId) {
        const asset = await client.assets.upload(
            'image',
            createReadStream(path.join(IMAGES, filename)),
            { filename }
        );
        assetId = asset._id;
        assetCache.set(filename, assetId);
        console.log(`  ↑ ${filename}`);
    }

    return {
        _type: 'figure',
        alt,
        asset: { _type: 'reference', _ref: assetId }
    };
}

/** Turn plain paragraphs into Portable Text blocks. */
function blocks(...paragraphs: string[]) {
    return paragraphs.map((text) => ({
        _type: 'block',
        _key: randomUUID().slice(0, 12),
        style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: randomUUID().slice(0, 12), text, marks: [] }]
    }));
}

/** Array members need a stable `_key`. */
function keyed<T extends object>(items: T[]) {
    return items.map((item) => ({ ...item, _key: randomUUID().slice(0, 12) }));
}

function ref(id: string) {
    return { _type: 'reference' as const, _ref: id };
}

/** Create the document only if one matching `query` doesn't already exist. */
async function ensure(
    query: string,
    params: Record<string, unknown>,
    doc: Record<string, unknown>
) {
    const existing = await client.fetch<{ _id: string } | null>(query, params);
    if (existing?._id) {
        console.log(`  = ${doc._type} "${doc.title ?? doc.name}" already exists`);
        return existing._id;
    }
    const created = await client.create(doc as never);
    console.log(`  + ${doc._type} "${doc.title ?? doc.name}"`);
    return created._id;
}

// ── Content ──────────────────────────────────────────────────────────────────

async function run() {
    console.log('\nDisciplines');
    const disciplineNames = [
        'Product Sourcing',
        'Brand Strategy',
        'Graphic Design',
        'Visual Identity',
        'Experiential Marketing',
        'Event'
    ];
    const disciplines: Record<string, string> = {};
    for (const title of disciplineNames) {
        disciplines[title] = await ensure(
            '*[_type == "discipline" && title == $title][0]{_id}',
            { title },
            { _type: 'discipline', title }
        );
    }

    console.log('\nServices');
    const serviceSeed = [
        {
            title: 'Product Sourcing',
            description:
                'Every product is personally selected with your brand and values in mind, with a focus on Canadian-made and sustainably sourced merchandise — no catalogs, no guesswork.',
            file: 'productsourcing.jpg',
            alt: 'A curated flat lay of sustainably sourced branded merchandise'
        },
        {
            title: 'Brand Strategy',
            description:
                'We develop intentional brand strategies that align your merchandise with your core identity — ensuring every touchpoint reinforces what your brand stands for.',
            file: 'strategy.png',
            alt: 'Brand strategy materials laid out on a work surface'
        },
        {
            title: 'Visual Identity',
            description:
                'From typography to colour systems, we craft cohesive visual identities that translate seamlessly across every product and platform.',
            file: 'mattagami.png',
            alt: 'Mattagami visual identity applied across printed materials'
        },
        {
            title: 'Experiential Marketing',
            description:
                'We design immersive brand experiences and activations that leave a lasting impression — turning moments into memories and customers into advocates.',
            file: 'exp.jpg',
            alt: 'Guests at a branded experiential marketing activation'
        }
    ];
    const services: string[] = [];
    for (const item of serviceSeed) {
        services.push(
            await ensure(
                '*[_type == "service" && title == $title][0]{_id}',
                { title: item.title },
                {
                    _type: 'service',
                    title: item.title,
                    description: item.description,
                    image: await figure(item.file, item.alt)
                }
            )
        );
    }

    console.log('\nTestimonials');
    const testimonialSeed = [
        {
            quote: 'Rose was integral in helping us successfully create thoughtfully branded hoodies and blankets celebrating our 60K Customer Milestone. Rose & her team worked incredibly hard to meet our high quality bar and our team was thrilled with the keepsakes. I would strongly recommend working with Rose on your next project if you want it to feel elevated and well-tailored to your brand.',
            name: 'Marquisa Zrymiak',
            role: 'Employee Experience Coordinator at Janeapp'
        },
        {
            quote: 'Rose, thank you for your partnership, creativity, and collaboration. Every year, you go above and beyond with your support of our efforts and initiatives at Indigenous Skills, Employment, Apprenticeship and Development (ISEAD), meeting one tight deadline after another. We are so fortunate to count you among our friends. Your efforts contribute significantly to the success of our events.',
            name: 'Val Vanderwyk',
            role: 'Executive Director at ISEAD'
        },
        {
            quote: 'Rose Fitzgerald and the team at IICON ensured that our logo had the brand presence we needed to reach our objectives and to balance the professional look to appeal to our clientele with apparel suitable for the varying outdoor elements our crew have to work in.',
            name: 'Cody Price',
            role: 'President & CEO, MobileTire.CA'
        },
        {
            quote: "We received positive feedback from our visitors. They appreciated the 'gift' packaged in a sturdy retail styled gift box. Attendance to our booth increased to at least 20%-25%, everyone from our team was busy speaking with visitors and gathering contact information.",
            name: 'Cheral Muldoon',
            role: "Marketing & Advertising Director, Muldoon's Coffee Company"
        },
        {
            quote: 'We achieved our goal of commemorating a significant anniversary, produced merchandise our members would be proud to wear, created awareness of our local within our community, and attracted new members. The team at IICON Creative Strategies Inc did a great job in selecting the apparel, creating the logo design and the execution.',
            name: 'Corey Burke',
            role: 'Business Manager and Secretary Treasurer, Ironworkers Local 786'
        }
    ];
    const testimonials: string[] = [];
    for (const item of testimonialSeed) {
        testimonials.push(
            await ensure(
                '*[_type == "testimonial" && name == $name][0]{_id}',
                { name: item.name },
                { _type: 'testimonial', ...item }
            )
        );
    }

    console.log('\nCase studies');
    const caseStudySeed = [
        {
            title: 'Mobile Tire',
            slug: 'mobile-tire',
            seoTitle: 'Mobile Tire Project | IICON Creative Strategies',
            disciplines: ['Product Sourcing', 'Brand Strategy'],
            description: blocks(
                'To support MobileTire.ca’s growing business, we created a brand apparel program designed to elevate their professional image and build trust with customers—laying the groundwork for future franchising.',
                'The collection featured comfortable, all‑weather workwear in black to convey strength and reliability, with logos placed for maximum visibility and a red Canadian maple leaf embroidered on hats to showcase national pride. The refreshed brand presence helped drive a 30% increase in sales, with customers citing the company’s professional appearance as a key factor in their confidence and referrals—exceeding the original branding goals.'
            ),
            recognition: ['Winner of the 2021 PPAI International Gold Pyramid'],
            thumbnail: ['mobtire.jpg', 'Mobile Tire branded workwear'],
            images: [
                ['mobiletire.png', 'Mobile Tire crew wearing branded black workwear'],
                ['MB Crew Apparel.jpg', 'Mobile Tire branded apparel laid flat'],
                ['MB Crew Winter.jpg', 'Mobile Tire branded winter workwear laid flat']
            ],
            seoDescription:
                'Discover our work with Mobile Tire, a project involving product sourcing and brand strategy to develop a professional uniform program.'
        },
        {
            title: 'YWKW — In Her Shoes',
            slug: 'ywkw',
            seoTitle: 'YWKW Project | IICON Creative Strategies',
            disciplines: ['Product Sourcing', 'Brand Strategy', 'Graphic Design'],
            description: blocks(
                'Counsellors at YWKW were looking for new branded items for participants to sell through their thrift store—creating a hands‑on opportunity to build retail and employment skills while generating program support. Rather than traditional apparel, we proposed seed paper sprouting kits timed for Mother’s Day, spring planting, and end‑of‑year teacher gifts.',
                'Each kit included a plantable pot, peat moss, indigenous Ontario wildflower or herb seeds, and a custom printed, plantable seed‑paper wrap. The format aligned with the store’s low price points, appealed to its core audience of local women aged 25–45, and offered an easy‑to‑sell alternative to apparel. The organizers embraced the idea, especially given the seeds’ local origins and the fact that the seed paper company was founded by a Canadian woman—an inspiring role model for participants.',
                'To further connect the product to the program’s theme, participants were invited to submit artwork incorporating a shoe and elements from the sprouting kits. A selected illustration was featured on the packaging alongside YWKW messaging, resulting in a creative, meaningful product that supported skill‑building, storytelling, and purpose‑driven impact.'
            ),
            recognition: ['Winner of the 2024 PPAI International Gold Pyramid'],
            thumbnail: ['yw3.jpg', 'YWKW seed paper sprouting kit'],
            images: [
                ['yw6.jpg', 'YWKW sprouting kit with custom illustrated packaging'],
                ['yw4.jpg', 'YWKW seed paper wrap detail'],
                ['yw5.jpg', 'YWKW sprouting kits arranged together']
            ],
            seoDescription:
                'Learn about our collaboration with YWKW to create a sustainable, participant-driven product, winning the PPAI International Gold Pyramid Award.'
        },
        {
            title: 'Thirty6Xposures',
            slug: 'thirty6xposures',
            seoTitle: 'Thirty6Xposures Project | IICON Creative Strategies',
            disciplines: ['Product Sourcing', 'Event'],
            description: blocks(
                'To mark the launch of Season 2 of the thirty6Xposures Photography Challenge & Documentary Film, the producer wanted an on‑brand gift that was distinctive, practical, and unmistakably 36X. The Asobu Orb tumbler delivered, standing out in vibrant signature yellow with a rounded form reminiscent of a Kodak film canister.',
                'Finished with a clean black logo and paired with a 36X‑branded black trucker hat, the set felt bold, cohesive, and purposeful. Presented on the first day of filming, the gifts quickly became favourites—used on set, shared across social media, and even featured in the documentary. Their strong visual impact helped generate buzz beyond the shoot, sparking new interest from photographers, sponsors, and media partners, including a major Toronto outlet exploring future collaboration.'
            ),
            recognition: [],
            thumbnail: ['36-products-3.jpg', 'Thirty6Xposures branded tumbler and trucker hat'],
            images: [
                ['36-products-3.jpg', 'Thirty6Xposures branded tumbler and trucker hat'],
                ['36-shelf.jpg', 'Thirty6Xposures tumblers displayed on a shelf'],
                ['36-social.jpg', 'Thirty6Xposures gift set shared on social media']
            ],
            seoDescription:
                'Read about our event project for Thirty6Xposures, a photography challenge and documentary film gift program.'
        },
        {
            title: 'ISEAD',
            slug: 'isead',
            seoTitle: 'ISEAD Award Project | IICON Creative Strategies',
            disciplines: ['Product Sourcing', 'Brand Strategy', 'Event'],
            description: blocks(
                'At its November 2024 conference, Indigenous Skills, Employment, Apprenticeship and Development (ISEAD), formerly AABO, marked a pivotal new chapter with the launch of its new name and vision. To commemorate the milestone, we created ISEAD’s inaugural award—honouring partnerships with Canadian Building Trades Unions and Indigenous communities.',
                'Handcrafted in Canada from sustainably sourced wood and Lucite, the award featured a feather transforming into birds in flight, symbolizing growth, unity, and evolution. Presented to just five recipients at an intimate gala attended by 150–200 national leaders, the award made a powerful debut.',
                'A standout moment came when the Minister of Labour praised the design while holding the ISEAD Diversity Award—a moment widely shared across media platforms, helping elevate ISEAD’s profile and firmly position the conference on the national stage. The program achieved its goals of recognition, engagement, and cultural alignment, reinforcing ISEAD’s mission and inspiring continued partnership.'
            ),
            recognitionLabel: 'Winner of the:',
            recognition: [
                'PPAI Silver Pyramid Award (International)',
                'PPPC Silver Image Award (Canada)'
            ],
            thumbnail: ['isead-awards-still.jpg', 'The ISEAD Diversity Award in wood and Lucite'],
            images: [
                ['isead-awards-still.jpg', 'The ISEAD Diversity Award in wood and Lucite'],
                ['isead-awards-still-2.jpg', 'Detail of the ISEAD award feather motif'],
                ['isead-awards.jpg', 'ISEAD award recipients at the 2024 gala'],
                ['isead-awards-2.jpg', 'Group photo of ISEAD award recipients']
            ],
            seoDescription:
                'Our experience designing the inaugural ISEAD Diversity Award, honoring partnerships with Canadian Building Trades Unions and Indigenous communities. Winner of the PPAI Silver Pyramid Award.'
        }
    ];

    const caseStudies: Record<string, string> = {};
    for (const item of caseStudySeed) {
        const images = [];
        for (const [file, alt] of item.images) images.push(await figure(file, alt));

        caseStudies[item.slug] = await ensure(
            '*[_type == "caseStudy" && slug.current == $slug][0]{_id}',
            { slug: item.slug },
            {
                _type: 'caseStudy',
                title: item.title,
                slug: { _type: 'slug', current: item.slug },
                disciplines: keyed(item.disciplines.map((name) => ref(disciplines[name]))),
                description: item.description,
                ...(item.recognitionLabel ? { recognitionLabel: item.recognitionLabel } : {}),
                recognition: item.recognition,
                thumbnail: await figure(item.thumbnail[0], item.thumbnail[1]),
                images: keyed(images),
                seo: { _type: 'seo', title: item.seoTitle, description: item.seoDescription }
            }
        );
    }

    console.log('\nSingletons');
    const shareImage = await figure('meta.png', 'IICON Creative Strategies');

    await client.createOrReplace({
        _id: 'siteSettings',
        _type: 'siteSettings',
        siteName: 'IICON Creative Strategies',
        navLinks: keyed([
            { _type: 'link', label: 'About', href: '/about' },
            { _type: 'link', label: 'Work', href: '/work' },
            { _type: 'link', label: 'Contact', href: '/contact' }
        ]),
        navCta: { _type: 'link', label: 'Get in touch', href: '/contact' },
        email: 'rose@iicon.ca',
        phone: '+1 416 509 4715',
        socialLinks: keyed([
            {
                _type: 'link',
                label: 'Instagram',
                href: 'https://www.instagram.com/iiconcreativestrategies'
            },
            {
                _type: 'link',
                label: 'Facebook',
                href: 'https://www.facebook.com/profile.php?id=100063587556958'
            },
            {
                _type: 'link',
                label: 'LinkedIn',
                href: 'https://ca.linkedin.com/company/iicon-creative-strategies-inc-'
            }
        ]),
        footerHeadline: "Let's build something\nmeaningful.",
        form: {
            nameLabel: "What's your name?*",
            emailLabel: 'Your email*',
            messageLabel: 'What did you have in mind?*',
            submitLabel: 'Submit'
        },
        defaultSeo: {
            _type: 'seo',
            title: 'IICON Creative Strategies',
            description:
                'IICON Creative Strategies is a specialist branding studio that combines strategic thinking with the science of human connection.',
            shareImage
        }
    });
    console.log('  ✓ siteSettings');

    await client.createOrReplace({
        _id: 'homePage',
        _type: 'homePage',
        heroImage: await figure('iicon_bw.jpg', 'IICON Creative Strategies studio portrait'),
        approachLabel: 'Our Approach',
        approachStatement:
            'We believe your merchandise should honour the values of your brand. Every item we source is chosen with care, selected to reflect the story and standards that set your business apart.',
        approachImage: await figure('mountains.png', 'Canadian mountain landscape'),
        approachBody:
            'We take a personalized, intentional approach, curating merchandise from Union Made, Canadian Made, and Canadian‑owned suppliers, each chosen for their story of sustainability, responsible manufacturing, and reduced environmental impact.',
        approachCta: { _type: 'link', label: 'Learn More', href: '/about' },
        awardsLabel: 'Awards',
        awards: keyed([
            {
                _type: 'award',
                year: '2026',
                organization: 'PPAI',
                title: 'International Gold Pyramid Award',
                category: 'Not for Profit'
            },
            {
                _type: 'award',
                year: '2025',
                organization: 'PPAI',
                title: 'International Silver Pyramid Award',
                category: 'Employee Incentives & Recognition'
            },
            {
                _type: 'award',
                year: '2025',
                organization: 'PPPC',
                title: 'Canadian Silver Image Award',
                category: 'Cause or Charity Marketing'
            },
            {
                _type: 'award',
                year: '2024',
                organization: 'PPAI',
                title: 'International Gold Pyramid Award',
                category: 'Not for Profit'
            },
            {
                _type: 'award',
                year: '2023',
                organization: 'PPAI',
                title: 'International Silver Pyramid Award',
                category: 'Employee Incentives and Recognition'
            },
            {
                _type: 'award',
                year: '2021',
                organization: 'PPAI',
                title: 'International Gold Pyramid Award',
                category: 'Client Branding'
            }
        ]),
        testimonials: keyed(testimonials.map(ref)),
        galleryImages: keyed([
            await figure('gall1.jpg', 'IICON and friends'),
            await figure('gall2.jpg', 'IICON and friends'),
            await figure('gall4.jpg', 'IICON and friends'),
            await figure('gall5.jpg', 'IICON and friends'),
            await figure('gall6.jpg', 'IICON and friends'),
            await figure('gall7.jpg', 'IICON and friends'),
            await figure('gall8.jpg', 'IICON and friends')
        ]),
        servicesLabel: 'Services',
        services: keyed(services.map(ref)),
        projectsLabel: 'Selected Projects',
        featuredProjects: keyed(
            ['mobile-tire', 'ywkw', 'thirty6xposures', 'isead'].map((slug) =>
                ref(caseStudies[slug])
            )
        ),
        seo: {
            _type: 'seo',
            title: 'IICON Creative Strategies | Specialist Branding Studio',
            description:
                'IICON Creative Strategies is a specialist branding studio that combines strategic thinking with the science of human connection.'
        }
    });
    console.log('  ✓ homePage');

    await client.createOrReplace({
        _id: 'aboutPage',
        _type: 'aboutPage',
        introLabel: 'Information',
        intro: 'IICON Creative Strategies is a specialist branding studio that combines strategic thinking with the science of human connection. We source merchandise responsibly, design with cultural and psychological intention, and partner with clients who share our commitment to quality and ethical practice. As a minority woman-owned and Canadian company, we are selective yet comprehensive—delivering branded work that earns its place in people’s lives.',
        valuesLabel: 'Our Values',
        values: keyed([
            {
                _type: 'valueColumn',
                body: blocks(
                    'The products we choose, the suppliers we partner with, and the standards we hold ourselves to are all rooted in the same values: sustainability, ethics, and responsibility. We focus on products that are sustainably sourced, ethically made, and built to last.',
                    'Quality and responsibility go hand in hand, and the best way to reduce waste is to create things people actually want to keep.'
                )
            },
            {
                _type: 'valueColumn',
                body: blocks(
                    'Every manufacturer in our network is held to strong ethical, social, and safety standards, supported by third-party audits and environmental accountability. Whether Made in Canada, Made in North America, or ethically sourced offshore, we stand behind what we offer.',
                    'Our relationships — with clients and supplier partners — are our greatest asset. We invest in them for the long term.'
                )
            }
        ]),
        contactLabel: 'Contact',
        seo: {
            _type: 'seo',
            title: 'About Us | IICON Creative Strategies',
            description:
                'Learn about the values and approach of IICON Creative Strategies, a responsible promotional products supplier.'
        }
    });
    console.log('  ✓ aboutPage');

    await client.createOrReplace({
        _id: 'workPage',
        _type: 'workPage',
        heading: 'Selected Projects',
        projects: keyed(
            ['mobile-tire', 'ywkw', 'thirty6xposures', 'isead'].map((slug) =>
                ref(caseStudies[slug])
            )
        ),
        seo: {
            _type: 'seo',
            title: 'Our Work | IICON Creative Strategies',
            description:
                'A portfolio of selected projects by IICON Creative Strategies. See our work in product sourcing, brand strategy, and event design.'
        }
    });
    console.log('  ✓ workPage');

    await client.createOrReplace({
        _id: 'contactPage',
        _type: 'contactPage',
        seo: {
            _type: 'seo',
            title: 'Contact Us | IICON Creative Strategies',
            description:
                'Get in touch with IICON Creative Strategies to build something meaningful together. We partner with clients who share our commitment to quality.'
        }
    });
    console.log('  ✓ contactPage');

    console.log('\nDone.\n');
}

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
