import { useEffect, useRef, useState } from "react";
export function useObserver(options = {}) {
//Estado que nos muestra la informacion de si un elemento(s) a observar esta insterceptado o visible.
    let [entries, setEntries] = useState<IntersectionObserverEntry[] | null>(null);
//Estado que servira para especificar que elemento(s) se quieran observar
    let [elements, setElements] = useState<NodeListOf<HTMLElement> | HTMLElement[] | null>(null);
    let observer = useRef<IntersectionObserver | null>();
    useEffect(() => {
//Verifica que exista windows y la api en caso de que se este usando en un framework con SSR
        if (typeof window !== 'undefined' && window.IntersectionObserver) {
            observer.current = new IntersectionObserver((entries) => {
                setEntries(entries)
            }, options)
        } else {
            observer.current = null
        }
    }, [])
    useEffect(() => {
        if (!observer) return
        if (!elements) return
        let currentObserver = observer.current!;
//Le indicamos los elemento(s) va a observar
        if (elements.length > 1) {
            for (let element of elements) {
                currentObserver.observe(element);
            }
        } else {
            currentObserver.observe(elements[0]);
        }
        return () => {
//Si existe un observer activo lo desconectamos
            currentObserver && currentObserver.disconnect();
        }
    }, [elements])
    return { entries, observer: observer.current, setElements }
}