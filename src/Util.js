// Copyright 2021, Banson Tong, All rights reserved

import { useState, useEffect } from 'react';

export const filterDuplicates = (properties) => {
    return properties.filter(
        (property, index, self) =>
            index ===
            self.findIndex(
                (p) =>
                    p.name === property.name ||
                    (p.address === property.address &&
                        p.layout === property.layout &&
                        p.area === property.area &&
                        p.age === property.age)
            )
    );
};

export const filterMissingImages = (properties) => {
    return properties.filter(
        (property) =>
            property.image !== '' &&
            property.image !== 'None' &&
            property.image !== 'https://maintenance.suumo.jp/maintenance.jpg'
    );
};

export const useOnScreen = (ref) => {
    const [isIntersecting, setIntersecting] = useState(false);

    const observer = new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting));

    useEffect(() => {
        observer.observe(ref.current);
        // Remove the observer as soon as the component is unmounted
        return () => {
            observer.disconnect();
        };
    }, [observer, ref]);

    return isIntersecting;
};

export const saveToHistory = (property, onSaved) => {
    const historyKey = 'history';

    let restoredHistory = JSON.parse(localStorage.getItem(historyKey));
    let isDuplicate = false;
    for (let i = 0; i < restoredHistory.length; i++) {
        if (restoredHistory[i].item.suumoLink === property.suumoLink) {
            isDuplicate = true;
            break;
        }
    }
    if (!isDuplicate) {
        restoredHistory.push({ id: Date.now(), item: property });
        localStorage.setItem(historyKey, JSON.stringify(restoredHistory));
    }
    if (onSaved) {
        onSaved(restoredHistory);
    }
};
