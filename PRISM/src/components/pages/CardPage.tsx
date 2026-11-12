'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import MarkdownBlock from '@/components/ui/MarkdownBlock';
import { CardPageConfig, CardItem } from '@/types/page';

interface CardPageProps {
    config: CardPageConfig;
    embedded?: boolean;
}

const CARD_CLASSES = 'group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all duration-200 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900';

const GRID_COLUMNS: Record<number, string> = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
};

const CONTENT_CLAMP: Record<number, string> = {
    2: 'line-clamp-2',
    3: 'line-clamp-3',
    4: 'line-clamp-4',
    5: 'line-clamp-5',
    6: 'line-clamp-6',
};

function CardBody({ item, embedded, clampClass }: { item: CardItem; embedded: boolean; clampClass: string }) {
    return (
        <>
            {item.image && (
                <div className={`relative w-full shrink-0 overflow-hidden bg-neutral-100 dark:bg-neutral-800 ${embedded ? 'aspect-[2/1]' : 'aspect-[16/9]'}`}>
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 420px"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                </div>
            )}
            <div className={`flex flex-1 flex-col ${embedded ? 'p-4' : 'p-6'}`}>
                <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className={`${embedded ? 'text-lg' : 'text-xl'} font-semibold text-primary`}>{item.title}</h3>
                    {item.date && (
                        <span className="shrink-0 rounded bg-neutral-100 px-2 py-1 text-sm font-medium text-neutral-500 dark:bg-neutral-800">
                            {item.date}
                        </span>
                    )}
                </div>
                {item.subtitle && (
                    <p className={`${embedded ? 'text-sm' : 'text-base'} mb-3 font-medium text-accent`}>{item.subtitle}</p>
                )}
                {item.content && (
                    <MarkdownBlock
                        content={item.content}
                        className="mb-0"
                        bodyClassName={`${embedded ? 'text-sm' : 'text-base'} text-neutral-600 dark:text-neutral-500 leading-relaxed ${clampClass}`}
                    />
                )}
                {item.tags && (
                    <div className="mt-auto flex flex-wrap gap-2 pt-4">
                        {item.tags.map(tag => (
                            <span key={tag} className="rounded border border-neutral-100 bg-neutral-50 px-2 py-1 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-800/50">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default function CardPage({ config, embedded = false }: CardPageProps) {
    const columnClass = GRID_COLUMNS[config.columns || 1] || '';
    const clampClass = CONTENT_CLAMP[config.clamp_lines || 0] || '';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className={embedded ? "mb-4" : "mb-8"}>
                <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
                {config.description && (
                    <MarkdownBlock
                        content={config.description}
                        className="max-w-2xl"
                        bodyClassName={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 leading-relaxed`}
                    />
                )}
            </div>

            <div className={`grid grid-cols-1 ${embedded ? "gap-4" : "gap-6"} ${columnClass}`}>
                {config.items.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="h-full"
                    >
                        {item.link ? (
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={item.title}
                                className={CARD_CLASSES}
                            >
                                <CardBody item={item} embedded={embedded} clampClass={clampClass} />
                            </a>
                        ) : (
                            <div className={CARD_CLASSES}>
                                <CardBody item={item} embedded={embedded} clampClass={clampClass} />
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
