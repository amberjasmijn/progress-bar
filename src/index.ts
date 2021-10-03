type Status = 'running' | 'stopped' | 'idle'

interface State {
  progress: number
  isRendered: boolean
  status: Status[]
}

const initialState = (): State => ({ progress: 0.08, isRendered: false, status: ['idle'] })

let animationId

let state = initialState()

const removeFirst = (statuses: Status[]): Status[] => statuses.slice(1)

const css = (element: HTMLDivElement, style: any) => {
  for (const property in style) { element.style[property] = style[property] }
}

function clamp (n: number, min: number, max: number) {
  if (n < min) return min
  if (n > max) return max
  return n
}

const toPercentage = (n: number) => (-1 + n) * 100

// Render the progress bar with the new state
const render = () => {
  if (!state.isRendered) {
    const progress = document.createElement('div')
    progress.innerHTML = '<div class="bar" role="bar"></div>'
    document.querySelector('body')?.appendChild(progress)

    const bar = document.querySelector('.bar') as HTMLDivElement

    const style = { background: 'black', width: '100%', height: '5px', position: 'fixed', top: '0', left: '0', transform: 'translate3d(-100%,0,0)', transition: 'all 200ms' }

    css(bar, style)

    state = {
      ...state,
      isRendered: true,
      status: ['running']
    }
  }
}

const set = () => {
  const bar = document.querySelector('.bar') as HTMLDivElement

  const style = { background: 'black', width: '100%', height: '5px', position: 'fixed', top: '0', left: '0', transform: 'translate3d(' + toPercentage(state.progress) + '%,0,0)', transition: 'all 200ms ease-in' }

  const stoppedStyled = { background: 'black', width: '100%', height: '5px', position: 'fixed', top: '0', left: '0', transform: 'translate3d(' + toPercentage(1) + '%,0,0)', transition: 'all 200ms ease-in' }

  if (getStatus(state) === 'stopped') {
    css(bar, stoppedStyled)

    return setTimeout(() => {
      const container = bar.parentElement
      if (container) {
        removeElement(container)
      }
    }, 600)
  }

  if (bar) {
    return css(bar, style)
  }
}

const increment = (state: State): number => {
  return clamp(state.progress + Math.random() * 0.04, 0, 0.994)
}

const isRendered = () => !!document.querySelector('.bar')

const nextStatus = (state: State): Status[] => state.status.length > 1 ? removeFirst(state.status) : state.status

// Update the state
const next = (state: State): State => ({
  ...state,
  isRendered: isRendered(),
  progress: increment(state),
  status: nextStatus(state)
})

const reset = () => initialState()

const removeElement = (element: HTMLElement): void => element.remove()

const enqueueStatus = (state: State, status: Status): State =>
  ({ ...state, status: state.status.concat(status) })

const getStatus = (s: State): Status => s.status[0]

const run = (t1: number) => (t2: number) => {
  if (t2 - t1 > 800) {
    if (getStatus(state) === 'stopped') {
      state = reset()
      window.cancelAnimationFrame(animationId)
    } else {
      state = next(state)
      set()
      animationId = window.requestAnimationFrame(run(t2))
    }
  } else {
    animationId = window.requestAnimationFrame(run(t1))
  }
}

document.getElementById('start')?.addEventListener('click', () => {
  render()
  animationId = window.requestAnimationFrame(run(0))
})

document.getElementById('stop')?.addEventListener('click', () => {
  state = enqueueStatus(state, 'stopped')
})
