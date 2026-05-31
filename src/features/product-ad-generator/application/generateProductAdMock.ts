import { GeneratedProductAd, ProductAdFormData } from '../domain/productAdTypes';

const toNumber = (value: string) => Number(value.replace(',', '.')) || 0;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const calculateCommercialMargin = (costPrice: string, salePrice: string) => {
  const cost = toNumber(costPrice);
  const sale = toNumber(salePrice);

  if (cost <= 0 || sale <= 0) {
    return 0;
  }

  return Math.round(((sale - cost) / sale) * 100);
};

const calculateSeoScore = (data: ProductAdFormData) => {
  const titleLength = data.productName.trim().length;
  const featureScore = clamp(data.features.length * 8, 0, 32);
  const titleScore = titleLength >= 20 && titleLength <= 70 ? 24 : clamp(titleLength / 3, 8, 18);
  const clarityScore = data.category && data.audience && data.marketplace ? 20 : 8;
  const keywordScore = data.features.some((feature) =>
    data.productName.toLowerCase().includes(feature.toLowerCase().split(' ')[0]),
  )
    ? 16
    : 10;
  const commercialScore = calculateCommercialMargin(data.costPrice, data.salePrice) > 0 ? 8 : 2;

  return clamp(Math.round(featureScore + titleScore + clarityScore + keywordScore + commercialScore), 58, 98);
};

export const generateProductAdMock = async (data: ProductAdFormData): Promise<GeneratedProductAd> => {
  await new Promise((resolve) => setTimeout(resolve, 1400));

  const topFeatures = data.features.slice(0, 4);
  const seoScore = calculateSeoScore(data);
  const marketplaceCue =
    data.marketplace === 'Mercado Livre' ? 'envio rápido e alta conversão' : 'anúncios com foco em compra imediata';

  return {
    seoTitle: `${data.productName} ${topFeatures.slice(0, 2).join(' ')} para ${data.audience}`,
    description:
      `${data.productName} é uma opção ${data.tone.toLowerCase()} para quem busca ${topFeatures.join(', ')}. ` +
      `Ideal para o público ${data.audience.toLowerCase()}, com apresentação otimizada para ${data.marketplace}, ` +
      `${marketplaceCue} e copy pensada para destacar benefícios antes das especificações.`,
    hashtags: [
      `#${data.marketplace.replace(/\s/g, '')}`,
      `#${data.category}`,
      '#Oferta',
      '#IA',
      '#ProdutoDestaque',
    ],
    seoScore,
    keywords: [
      data.productName,
      data.category,
      data.marketplace,
      data.audience,
      ...topFeatures,
    ],
  };
};
