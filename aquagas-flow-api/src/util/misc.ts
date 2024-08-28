export function getRandomInt(): number {
    return Math.floor(Math.random() * 1_000_000_000_000);
}

export function tick(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, milliseconds);
    });
}