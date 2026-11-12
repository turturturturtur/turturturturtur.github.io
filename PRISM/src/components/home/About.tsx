'use client';

import { motion } from 'framer-motion';
import MarkdownBlock from '@/components/ui/MarkdownBlock';
import { useMessages } from '@/lib/i18n/useMessages';

interface AboutProps {
    content: string;
    title?: string;
}

export default function About({ content, title }: AboutProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.about;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
        >
            <MarkdownBlock
                title={resolvedTitle}
                content={content}
                className=""
                bodyClassName="text-neutral-700 dark:text-neutral-600 leading-relaxed"
            />
        </motion.section>
    );
}
