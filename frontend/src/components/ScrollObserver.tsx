'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollObserver() {
    const pathname = usePathname();

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // We can optionally unobserve after it becomes visible
                    // observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Small delay to ensure the DOM is ready after navigation
        const timeoutId = setTimeout(() => {
            const elements = document.querySelectorAll('.observe-animate');
            elements.forEach((el) => {
                observer.observe(el);
            });
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            observer.disconnect();
        };
    }, [pathname]);

    return null;
}
