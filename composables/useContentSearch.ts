export const useContentSearch = () => {
  // 特殊文字をエスケープする関数
  const escapeForLike = (str: string): string => {
    return str.replace(/[%_]/g, '\\$&')
  }

  // タイトルで検索
  const searchByTitle = async (searchQuery: string, options = {}) => {
    const escapedQuery = escapeForLike(searchQuery)
    const query = queryCollection('articles')
      .where('title', 'LIKE', `%${escapedQuery}%`)
      .order('date', 'DESC')
    
    if (options.limit) query.limit(options.limit)
    if (options.skip) query.skip(options.skip)
    if (options.select) query.select(...options.select)
    
    return query.all()
  }

  // タグで検索
  const searchByTag = async (tag: string, options = {}) => {
    const escapedTag = escapeForLike(tag)
    const query = queryCollection('articles')
      .where('tags', 'LIKE', `%${escapedTag}%`)
      .order('date', 'DESC')
    
    if (options.limit) query.limit(options.limit)
    if (options.skip) query.skip(options.skip)
    if (options.select) query.select(...options.select)
    
    return query.all()
  }

  // 複合検索
  const searchArticles = async (filters = {}, options = {}) => {
    let query = queryCollection('articles')
    
    if (filters.title) {
      const escapedTitle = escapeForLike(filters.title)
      query = query.where('title', 'LIKE', `%${escapedTitle}%`)
    }
    
    if (filters.tag) {
      const escapedTag = escapeForLike(filters.tag)
      query = query.where('tags', 'LIKE', `%${escapedTag}%`)
    }
    
    query = query.order('date', 'DESC')
    
    if (options.limit) query.limit(options.limit)
    if (options.skip) query.skip(options.skip)
    if (options.select) query.select(...options.select)
    
    return query.all()
  }

  // カウント用の検索
  const countArticles = async (filters = {}) => {
    let query = queryCollection('articles')
    
    if (filters.title) {
      const escapedTitle = escapeForLike(filters.title)
      query = query.where('title', 'LIKE', `%${escapedTitle}%`)
    }
    
    if (filters.tag) {
      const escapedTag = escapeForLike(filters.tag)
      query = query.where('tags', 'LIKE', `%${escapedTag}%`)
    }
    
    return query.count()
  }

  return {
    escapeForLike,
    searchByTitle,
    searchByTag,
    searchArticles,
    countArticles
  }
}