export const useOrigin = () => {
  console.log('what')
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : ''

  return origin
}
