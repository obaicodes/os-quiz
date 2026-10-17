// Minimal hash router: "#/review/abc" -> { name: 'review', param: 'abc' }.
// Hash routing keeps GitHub Pages working without server-side rewrites.

export interface Route {
  name: string
  param?: string
}

function parse(hash: string): Route {
  const [name = '', param] = hash.replace(/^#\/?/, '').split('/')
  return { name: name || 'home', param }
}

export const route = $state<Route>(parse(location.hash))

window.addEventListener('hashchange', () => {
  const next = parse(location.hash)
  route.name = next.name
  route.param = next.param
})

export function go(path: string) {
  location.hash = path.startsWith('#') ? path : `#/${path.replace(/^\//, '')}`
}
