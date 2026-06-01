export function formatUser(user) {
  if (!user) return null;
  const { password, firstname, lastname, ...rest } = user;
  return { ...rest, _id: user.id, name: { firstname: firstname || '', lastname: lastname || '' } };
}

export function formatProduct(product) {
  if (!product) return null;
  const { category, ...rest } = product;
  return {
    ...rest,
    _id: product.id,
    category: category?.name || 'uncategorized',
    categoryId: product.categoryId || null,
  };
}

export function formatReview(review) {
  if (!review) return null;
  const { user, ...rest } = review;
  return {
    ...rest,
    _id: review.id,
    userId: user ? formatUser(user) : review.userId,
  };
}
