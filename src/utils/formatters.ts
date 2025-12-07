export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value);
};

export const formatNumber = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value);
};