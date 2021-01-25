export const rank = (ranks: string[][]): string[] => {
    const scores: any = {}
    ranks.forEach((r) => {
        r.forEach((restaurantId, index) => {
            const score = r.length - index
            if (restaurantId in scores) {
                scores[restaurantId] += score
            } else {
                scores[restaurantId] = score
            }
            
        })
    })
    let sortableRank: any = [];
    for (var restaurantId in scores) {
        sortableRank.push([restaurantId, scores[restaurantId]]);
    }
    return sortableRank.sort((a: any, b: any) => b[1] - a[1]).map((item: any) => item[0])
}