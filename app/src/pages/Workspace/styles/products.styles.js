import styled from 'styled-components'

const ProductCell = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 215px;
`

const ProductIcon = styled.span`
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  border: 1px solid ${({ $category }) => ({
    Електроніка: '#d9e8ff',
    Аксесуари: '#d8f3e4',
    'Для дому': '#ffe8d3',
    Одяг: '#f2dcff',
  }[$category] || '#e6e7ff')};
  border-radius: 12px;
  background: ${({ $category }) => ({
    Електроніка: '#edf5ff',
    Аксесуари: '#eafaf1',
    'Для дому': '#fff5e9',
    Одяг: '#f9efff',
  }[$category] || '#f0f0ff')};
  font-size: 21px;
`

const ProductName = styled.div`
  color: #26314a;
  font-size: 12px;
  font-weight: 750;
  white-space: normal;
`

const ProductDescription = styled.div`
  max-width: 270px;
  margin-top: 4px;
  color: #8a94a7;
  font-size: 10px;
  line-height: 1.5;
  white-space: normal;
`

const Sku = styled.span`
  color: #7e88a0;
  font-size: 11px;
  font-weight: 650;
  letter-spacing: 0.2px;
`

const CategoryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 9px;
  border-radius: 999px;
  background: #f0f1ff;
  color: #5556ce;
  font-size: 10px;
  font-weight: 700;
`

const StockBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 9px;
  border-radius: 999px;
  background: ${({ $low }) => ($low ? '#fff3e7' : '#eaf8f0')};
  color: ${({ $low }) => ($low ? '#b86a17' : '#238455')};
  font-size: 10px;
  font-weight: 750;
`

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 15px;
  padding: 18px;

  @media (max-width: 1150px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 650px) {
    grid-template-columns: minmax(0, 1fr);
    padding: 12px;
  }
`

const ProductCard = styled.article`
  min-width: 0;
  padding: 17px;
  border: 1px solid #e7eaf2;
  border-radius: 14px;
  background: #fff;
  transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;

  &:hover {
    border-color: #cfd0ff;
    box-shadow: 0 8px 24px rgba(47, 53, 130, 0.07);
    transform: translateY(-2px);
  }
`

const ProductCardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
`

const ProductCardPrice = styled.p`
  margin: 16px 0 7px;
  color: #242f4a;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.6px;
`

const ProductCardMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 9px;
  padding-top: 12px;
  border-top: 1px solid #edf0f6;
  color: #7a859b;
  font-size: 11px;
`

export { ProductCell, ProductIcon, ProductName, ProductDescription, Sku, CategoryBadge, StockBadge, ProductsGrid, ProductCard, ProductCardTop, ProductCardPrice, ProductCardMeta }
