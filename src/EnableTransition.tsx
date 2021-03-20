import * as React from 'react';
import requestAnimationFrame from 'raf';

export interface EnableTransitionProps {
    attribute: keyof CSSStyleDeclaration,
    displayNone?: {
        /**当display==none的时候 是否在动画消失的时候将宽度变成0**/
        setWidthZero: boolean,
        /**当display==none的时候 是否在动画消失的时候将高度变成0**/
        setHeightZero: boolean,
    },
    children: (ref: React.LegacyRef<any>) => React.ReactElement
}
interface CSSTransitionInfo {
    type: typeof TRANSITION | typeof ANIMATION | null
    propCount: number
    timeout: number
    hasTransform: boolean
}

const TRANSITION = 'transition';
const ANIMATION = 'animation';


/***
 * 取出2个字符数组中的最大值并转成毫秒
 * @param delays
 * @param durations
 */
function getTimeout(delays: string[], durations: string[]): number {
    while (delays.length < durations.length) {
        delays = delays.concat(delays)
    }
    return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])))
}

/**
 * 转成毫秒
 * @param s
 */
function toMs(s: string): number {
    return Number(s.slice(0, -1).replace(',', '.')) * 1000
}

/**
 *
 * @param el
 */
function getTransitionInfo(el: Element): CSSTransitionInfo {
    const styles: any = window.getComputedStyle(el)
    /***
     * JSDOM may return undefined for transition properties
     * TRANSITION 或者 ANIMATION 是多个属性的时候比如 transition:width 2s ease 5s, height 2s ease 5s;
     * @param key
     */
    const getStyleProperties = (key: string) => (styles[key] || '').split(', ');
    const transitionDelays = getStyleProperties(TRANSITION + 'Delay');
    const transitionDurations = getStyleProperties(TRANSITION + 'Duration');
    const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    const animationDelays = getStyleProperties(ANIMATION + 'Delay');
    const animationDurations = getStyleProperties(ANIMATION + 'Duration');
    const animationTimeout = getTimeout(animationDelays, animationDurations);
    const timeout = Math.max(transitionTimeout, animationTimeout)
    const type = timeout > 0
        ? (transitionTimeout > animationTimeout ? TRANSITION : ANIMATION)
        : null;
    const propCount = type
        ? (type === TRANSITION ? transitionDurations.length : animationDurations.length)
        : 0;
    const hasTransform =
        type === TRANSITION &&
        /\b(transform|all)(,|$)/.test(styles[TRANSITION + 'Property'])
    return {
        type,
        timeout,
        propCount,
        hasTransform
    }
}

/***
 * 动画结束
 * @param el
 * @param duration
 * @param cb
 */
function whenTransitionEnds(el: HTMLElement, duration: number, cb: () => void): void {
    if (duration !== undefined) {
        setTimeout(() => {
            cb()
        }, duration);
        return;
    }
    const {type, timeout, propCount} = getTransitionInfo(el);
    if (!type) {
        return cb()
    }
    let ended = 0;

    const end = () => {
        el.removeEventListener('transitionend',onEnd,false);
        el.removeEventListener('animationend',onEnd,false);
        cb();
    };
    const onEnd = (e: Event) => {
        if (e.target === el) {
            if (++ended >= propCount) {
                end();
            }
        }
    };

    setTimeout(() => {
        if (ended < propCount) {
            end()
        }
    }, timeout + 1);
    el.addEventListener('transitionend',onEnd,false);
    el.addEventListener('animationend',onEnd,false);
}



type Config<K> = {
    [P in keyof K]?: {
        init: (ref: React.MutableRefObject<any>) => void,
        main: (props: EnableTransitionProps, value: string, ref: React.MutableRefObject<any>) => string
    }
}
const flush = (ref: React.MutableRefObject<any>) => ref.current.scrollTop;

const config: Config<CSSStyleDeclaration> = {
    display: {
        init(ref: React.MutableRefObject<any>) {
            if (ref.current.style.display === 'none') {
                ref.current.prevDisplay = 'none';
            }
        },
        main(props: EnableTransitionProps, value: string, ref: React.MutableRefObject<any>) {
            const {
                displayNone = {
                    setWidthZero: true,
                    setHeightZero: true
                }
            } = props;
            if (value === 'none') {

                if (ref.current.prevDisplay !== 'none') {
                    value = 'block';
                    const _style = window.getComputedStyle(ref.current)
                    const origin = {
                        overflow: ref.current.style['overflow'],
                        width: ref.current.style['width'],
                        seeWidth: _style['width'],
                        height: ref.current.style['height'],
                        seeHeight: _style['height'],
                    };
                    requestAnimationFrame(() => {
                        const to = {
                            overflow: ref.current.style['overflow'],
                            width: ref.current.style['width'],
                            seeWidth: 0,
                            height: ref.current.style['height'],
                            seeHeight: 0,
                        };
                        const {transition} = ref.current.style;
                        const {animation} = ref.current.style;

                        /**为了防止下面设置宽度高度的时候出现动画***/
                        ref.current.style['transition'] = '';
                        ref.current.style['animation'] = '';
                        requestAnimationFrame(() => {

                            ref.current.style['display'] = 'block';
                            ref.current.style['overflow'] = origin.overflow;
                            displayNone.setWidthZero && (ref.current.style['width'] = origin.seeWidth);
                            displayNone.setHeightZero && (ref.current.style['height'] = origin.seeHeight);
                            requestAnimationFrame(() => {
                                ref.current.style['transition'] = transition;
                                ref.current.style['animation'] = animation;
                                ref.current.style['overflow'] = 'hidden';
                                displayNone.setWidthZero && (ref.current.style['width'] = to.seeWidth);
                                displayNone.setHeightZero && (ref.current.style['height'] = to.seeHeight);

                                requestAnimationFrame(() => {
                                    whenTransitionEnds(ref.current, undefined, () => {
                                        ref.current.prevDisplay = 'none';
                                        ref.current.style['overflow'] = to.overflow;
                                        ref.current.style['display'] = 'none';
                                        displayNone.setWidthZero && (ref.current.style['width'] = to.width);
                                        displayNone.setHeightZero && (ref.current.style['height'] = to.height);
                                    });
                                })
                            })

                        })

                    });
                }

            } else {

                if (ref.current.prevDisplay === 'none') {

                    requestAnimationFrame(() => {
                        const _style = window.getComputedStyle(ref.current)
                        const to = {
                            overflow: ref.current.style['overflow'],
                            width: ref.current.style['width'],
                            seeWidth: _style['width'],
                            height: ref.current.style['height'],
                            seeHeight: _style['height'],
                        };
                        const {transition} = ref.current.style;
                        const {animation} = ref.current.style;

                        /**为了防止下面设置宽度高度的时候出现动画***/
                        ref.current.style['transition'] = '';
                        ref.current.style['animation'] = '';

                        ref.current.style['overflow'] = 'hidden';
                        displayNone.setWidthZero && (ref.current.style['width'] = '0px');
                        displayNone.setHeightZero && (ref.current.style['height'] = '0px');

                        requestAnimationFrame(() => {
                            ref.current.style['transition'] = transition;
                            ref.current.style['animation'] = animation;
                            ref.current.style['overflow'] = 'hidden';
                            displayNone.setWidthZero && (ref.current.style['width'] = to.seeWidth);
                            displayNone.setHeightZero && (ref.current.style['height'] = to.seeHeight);
                            requestAnimationFrame(() => {
                                whenTransitionEnds(ref.current, undefined, () => {
                                    ref.current.style['overflow'] = to.overflow;
                                    displayNone.setWidthZero && (ref.current.style['width'] = to.width);
                                    displayNone.setHeightZero && (ref.current.style['height'] = to.height);
                                });
                            })

                        })
                    });

                }
                ref.current.prevDisplay = value

            }
            return value;
        }
    },
    visibility: {
        init(ref: React.MutableRefObject<any>) {
            if (ref.current.style.visibility === 'hidden') {
                ref.current.prevVisibility = 'hidden';
            }
        },
        main(props: EnableTransitionProps, value: string, ref: React.MutableRefObject<any>) {
            if (value === 'hidden') {
                if (ref.current.prevVisibility !== 'hidden') {
                    value = 'visible';
                    const {
                        transition,
                        animation,
                        opacity
                    } = ref.current.style;
                    /**为了防止下面设置宽度高度的时候出现动画***/
                    ref.current.style['transition'] = '';
                    ref.current.style['animation'] = '';
                    ref.current.style['opacity'] = 1;
                    flush(ref);
                    ref.current.style['transition'] = transition;
                    ref.current.style['animation'] = animation;
                    ref.current.style['opacity'] = 0;
                    flush(ref);
                    whenTransitionEnds(ref.current, undefined, () => {
                        ref.current.style['transition'] = '';
                        ref.current.style['animation'] = '';
                        ref.current.style['opacity'] = opacity;
                        ref.current.prevVisibility = 'hidden';
                        ref.current.style['visibility'] = 'hidden';
                        flush(ref);
                        ref.current.style['transition'] = transition;
                        ref.current.style['animation'] = animation;
                    });
                }

            } else {
                if (ref.current.prevVisibility === 'hidden') {
                    requestAnimationFrame(() => {
                        const {
                            transition,
                            animation,
                            opacity
                        } = ref.current.style;
                        /**为了防止下面设置宽度高度的时候出现动画***/
                        ref.current.style['transition'] = '';
                        ref.current.style['animation'] = '';
                        ref.current.style['opacity'] = 0;
                        flush(ref);
                        ref.current.style['transition'] = transition;
                        ref.current.style['animation'] = animation;
                        ref.current.style['opacity'] = 1;
                        flush(ref);
                        whenTransitionEnds(ref.current, undefined, () => {
                            ref.current.style['transition'] = '';
                            ref.current.style['animation'] = '';
                            ref.current.style['opacity'] = opacity;
                            flush(ref);
                            ref.current.style['transition'] = transition;
                            ref.current.style['animation'] = animation;
                        });
                    })
                }
                ref.current.prevVisibility = value

            }
            return value;
        }
    }
};


/**
 * 属性从有变成没有之类的动画
 * @param props
 * @constructor
 */
function EnableTransition(props: EnableTransitionProps): React.ReactElement {
    const ref = React.useRef(undefined);
    const st = React.useRef(false);
    const {
        attribute
    } = props;
    React.useEffect(() => {
        if (!st.current) {
            if (!(ref.current instanceof HTMLElement)) {
                console.warn('EnableTransition ref必须绑定在HTMLElement上')
                return;
            }

            if (ref.current.style[attribute] === '' || ref.current.style[attribute] === undefined) {
                ref.current.style.setProperty(attribute + '', window.getComputedStyle(ref.current)[attribute] as string);
            }
            config[attribute]?.init(ref);


            const {setProperty} = ref.current.style;
            ref.current.style.setProperty = (property: string, value: string | null, priority?: string) => {
                if (value === undefined || value === '' || value === 'auto') {
                    const origin = window.getComputedStyle(ref.current)[attribute];
                    requestAnimationFrame(() => {
                        const to = window.getComputedStyle(ref.current)[attribute];
                        ref.current.style[attribute] = origin;
                        requestAnimationFrame(() => {
                            ref.current.style[attribute] = to;
                        })
                    });
                    value = ''
                }

                config[attribute] && (value = config[attribute].main(props, value, ref));

                setProperty.call(ref.current.style, property, value, priority)
            };
            Object.defineProperty(ref.current.style, attribute, {
                set(v: string): void {
                    ref.current.style.setProperty(attribute, v)
                },
                get(): string {
                    return ref.current.style.getPropertyValue(attribute)
                }
            });
            st.current = true
        }

    }, [props.children]);
    return props.children(ref)
}

export default EnableTransition;
