import { $scroll } from '@scripts/stores/scroll';

import LocomotiveScroll, {
    type lenisTargetScrollTo,
    type ILenisScrollToOptions
} from 'locomotive-scroll';

const SCROLL_KEY = 'app:scrollY';

export class Scroll {
    static locomotiveScroll: LocomotiveScroll;
    private static _savePosition = () => {
        sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
    };

    // =============================================================================
    // Lifecycle
    // =============================================================================
    static init() {
        // Keep exactly one beforeunload listener alive at all times
        window.removeEventListener('beforeunload', this._savePosition);
        window.addEventListener('beforeunload', this._savePosition);

        this.locomotiveScroll = new LocomotiveScroll({
            scrollCallback({ scroll, limit, velocity, direction, progress }) {
                $scroll.set({
                    scroll,
                    limit,
                    velocity,
                    direction,
                    progress
                });
            }
        });

        // Restore saved position (only on a true page refresh, not a Swup navigation)
        const savedY = sessionStorage.getItem(SCROLL_KEY);
        if (savedY !== null) {
            sessionStorage.removeItem(SCROLL_KEY);
            const y = parseFloat(savedY);
            if (y > 0) {
                // rAF gives Lenis time to finish its first layout pass before scrolling.
                // Visibility was hidden in <head> to prevent the hero flash — reveal here.
                requestAnimationFrame(() => {
                    this.locomotiveScroll?.scrollTo(y, { immediate: true, force: true });
                    document.documentElement.style.visibility = '';
                });
            } else {
                document.documentElement.style.visibility = '';
            }
        }
    }

    static destroy() {
        this.locomotiveScroll?.destroy();
    }

    // =============================================================================
    // Methods
    // =============================================================================
    static start() {
        this.locomotiveScroll?.start();
    }

    static stop() {
        this.locomotiveScroll?.stop();
    }

    static addScrollElements(container: HTMLElement) {
        this.locomotiveScroll?.addScrollElements(container);
    }

    static removeScrollElements(container: HTMLElement) {
        this.locomotiveScroll?.removeScrollElements(container);
    }

    static scrollTo(target: lenisTargetScrollTo, options?: ILenisScrollToOptions) {
        this.locomotiveScroll?.scrollTo(target, options);
    }
}
