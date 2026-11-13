'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import MarkdownBlock from '@/components/ui/MarkdownBlock';
import { Publication } from '@/types/publication';
import { useMessages } from '@/lib/i18n/useMessages';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
    extraTitle?: string;
    extraContent?: string;
}

const VENUE_BADGE_CLASSES = 'rounded bg-blue-600 px-2 py-1 text-xs font-semibold leading-none text-white shadow-md';

export default function SelectedPublications({ publications, title, enableOnePageMode = false, extraTitle, extraContent }: SelectedPublicationsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.selectedPublications;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-serif font-bold text-primary">{resolvedTitle}</h2>
                <Link
                    href={enableOnePageMode ? "/#publications" : "/publications"}
                    prefetch={true}
                    className="text-accent hover:text-accent-dark text-sm font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                >
                    {messages.home.viewAll} →
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {publications.map((pub, index) => (
                    <motion.div
                        key={pub.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="group flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 shadow-sm transition-all duration-200 hover:shadow-lg dark:border-[rgba(148,163,184,0.24)] dark:bg-neutral-800"
                    >
                        {pub.firstPage && (
                            <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-white">
                                <Image
                                    src={`/papers/firstpage/${pub.firstPage}`}
                                    alt={pub.title}
                                    fill
                                    sizes="(max-width: 640px) 100vw, 350px"
                                    className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                                />
                                {pub.venueTag && (
                                    <span className={`absolute left-2 top-2 ${VENUE_BADGE_CLASSES}`}>
                                        {pub.venueTag}
                                    </span>
                                )}
                            </div>
                        )}
                        <div className="flex flex-1 flex-col p-4">
                            {!pub.firstPage && pub.venueTag && (
                                <span className={`mb-2 self-start ${VENUE_BADGE_CLASSES}`}>
                                    {pub.venueTag}
                                </span>
                            )}
                            <h3 className="font-semibold text-primary mb-2 leading-tight line-clamp-3">
                                {pub.title}
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-1 line-clamp-2">
                                {pub.authors.map((author, idx) => (
                                    <span key={idx}>
                                        <span className={`${author.isHighlighted ? 'font-semibold text-accent' : ''} ${author.isCoAuthor ? `underline underline-offset-4 ${author.isHighlighted ? 'decoration-accent' : 'decoration-neutral-500'}` : ''}`}>
                                            {author.name}
                                        </span>
                                        {author.isCorresponding && (
                                            <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600 dark:text-neutral-500'}`}>†</sup>
                                        )}
                                        {idx < pub.authors.length - 1 && ', '}
                                    </span>
                                ))}
                            </p>
                            {pub.description && (
                                <p className="text-sm text-neutral-500 dark:text-neutral-500 line-clamp-2">
                                    {pub.description}
                                </p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            <MarkdownBlock title={extraTitle} content={extraContent} titleAs="h3" />
        </motion.section>
    );
}
