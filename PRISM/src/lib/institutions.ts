const INSTITUTION_ICONS: { domain: string; icon: string }[] = [
    { domain: 'bhsf.lezhiyun.com', icon: '/institutions/bhsf.png' },
    { domain: 'hit.edu.cn', icon: '/institutions/hit.png' },
    { domain: 'sjtu.edu.cn', icon: '/institutions/sjtu.png' },
    { domain: 'kth.se', icon: '/institutions/kth.png' },
];

export function findInstitutionIcon(href?: string): string | null {
    if (!href) return null;

    let host: string;
    try {
        host = new URL(href, 'https://localhost').hostname.toLowerCase();
    } catch {
        return null;
    }

    const match = INSTITUTION_ICONS.find(
        (institution) => host === institution.domain || host.endsWith(`.${institution.domain}`),
    );

    return match ? match.icon : null;
}
