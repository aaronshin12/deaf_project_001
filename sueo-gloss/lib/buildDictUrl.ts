export function buildDictUrl(originNo: number, keyword: string): string {
  const encoded = encodeURIComponent(keyword);
  return `https://sldict.korean.go.kr/front/sign/signContentsView.do?origin_no=${originNo}&top_category=CTE&category=&searchKeyword=${encoded}&searchCondition=&search_gubun=&museum_type=00&current_pos_index=0`;
}

export function buildSearchUrl(keyword: string): string {
  const encoded = encodeURIComponent(keyword);
  return `https://sldict.korean.go.kr/front/sign/signList.do?top_category=CTE&category=&searchKeyword=${encoded}&searchCondition=&search_gubun=sign`;
}
