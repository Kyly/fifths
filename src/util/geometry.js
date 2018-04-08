const distanceBetweenTwoPoints = (first, second) => {
  const distance = Math.sqrt(((second.X - first.X) ** 2) + ((second.Y - first.Y) ** 2));
  return distance;
};

export default distanceBetweenTwoPoints;
