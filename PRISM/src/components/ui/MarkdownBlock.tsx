'use client';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { findInstitutionIcon } from '@/lib/institutions';

interface MarkdownBlockProps {
    title?: string;
    content?: string;
    titleAs?: 'h2' | 'h3';
    titleClassName?: string;
    className?: string;
    bodyClassName?: string;
}

export default function MarkdownBlock({
    title,
    content,
    titleAs = 'h2',
    titleClassName,
    className = 'mt-10',
    bodyClassName = 'text-sm text-neutral-700 dark:text-neutral-500 leading-relaxed',
}: MarkdownBlockProps) {
    if (!content) {
        return null;
    }

    const headingClass = titleClassName
        || (titleAs === 'h3'
            ? 'text-xl font-semibold text-primary mb-3'
            : 'text-2xl font-serif font-bold text-primary mb-4');

    return (
        <div className={className}>
            {title && (
                titleAs === 'h3'
                    ? <h3 className={headingClass}>{title}</h3>
                    : <h2 className={headingClass}>{title}</h2>
            )}
            <div className={bodyClassName}>
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => <h1 className="text-3xl font-serif font-bold text-primary mt-8 mb-4">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-serif font-bold text-primary mt-8 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-semibold text-primary mt-6 mb-3">{children}</h3>,
                        p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside space-y-1.5 ml-4">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1.5 ml-4">{children}</ol>,
                        li: ({ children }) => <li>{children}</li>,
                        a: ({ href, title, children }) => {
                            const icon = findInstitutionIcon(href);
                            return (
                                <a
                                    href={href}
                                    title={title}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-accent font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                                >
                                    {icon && (
                                        <Image
                                            src={icon}
                                            alt=""
                                            aria-hidden="true"
                                            width={20}
                                            height={20}
                                            className="inline-block h-[1.25em] w-[1.25em] align-[-0.32em] mr-1 rounded-[3px] bg-white object-contain ring-1 ring-neutral-200 dark:ring-neutral-700"
                                        />
                                    )}
                                    {children}
                                </a>
                            );
                        },
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
                                {children}
                            </blockquote>
                        ),
                        strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                        em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-500">{children}</em>,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
}
