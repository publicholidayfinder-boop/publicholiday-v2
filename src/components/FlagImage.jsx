import { useState } from 'react';
import { emojiMap } from '../utils/emojiMap';

/**
 * Renders a real country flag image from flagcdn.com.
 * Falls back to the emoji flag if the image fails to load.
 *
 * flagcdn.com supports width-based URLs: https://flagcdn.com/w{width}/{code}.png
 * Supported widths: 20, 40, 80, 160, 320, 640, 1280, 2560
 *
 * @param {string} countryCode - ISO 3166-1 alpha-2 code (e.g. "GH", "US")
 * @param {string} size - "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
 * @param {string} className - extra Tailwind classes
 */
export default function FlagImage({ countryCode, size = 'md', className = '' }) {
    const [failed, setFailed] = useState(false);
    const code = (countryCode || '').toLowerCase();

    // Map size names to: flagcdn width, rendered Tailwind class, aspect ratio preserved via object-contain
    const sizes = {
        xs:    { w: 20,  cls: 'h-3.5' },
        sm:    { w: 40,  cls: 'h-5'   },
        md:    { w: 40,  cls: 'h-7'   },
        lg:    { w: 80,  cls: 'h-10'  },
        xl:    { w: 80,  cls: 'h-14'  },
        '2xl': { w: 160, cls: 'h-20'  },
    };

    const { w, cls } = sizes[size] || sizes.md;

    if (failed || !code) {
        const emoji = emojiMap[countryCode?.toUpperCase()] || '🌍';
        const emojiSizes = {
            xs: 'text-base',
            sm: 'text-xl',
            md: 'text-2xl',
            lg: 'text-3xl',
            xl: 'text-4xl',
            '2xl': 'text-5xl',
        };
        return (
            <span
                className={`${emojiSizes[size] || 'text-2xl'} leading-none ${className}`}
                role="img"
                aria-label={countryCode}
            >
                {emoji}
            </span>
        );
    }

    return (
        <img
            src={`https://flagcdn.com/w${w}/${code}.png`}
            srcSet={`https://flagcdn.com/w${w * 2}/${code}.png 2x`}
            alt={`Flag of ${countryCode}`}
            onError={() => setFailed(true)}
            className={`${cls} w-auto object-contain rounded-sm shadow-sm flex-shrink-0 ${className}`}
            loading="lazy"
        />
    );
}
