export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value);
};

export const formatNumber = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value);
};

export const formatPercent = (value: number) => {
    return value.toFixed(2);
};
