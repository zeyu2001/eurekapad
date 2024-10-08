import type { MathfieldElement } from 'mathlive'
import React, { useEffect } from 'react'

/**
 * Set the visibility of the virtual keyboard and the menu in MathLive
 * @param ref - The ref of the MathfieldElement
 * @param keyboard - Whether to show the virtual keyboard
 * @param menu - Whether to show the menu
 */
export function useCustomizeMathlive(ref: React.RefObject<MathfieldElement>, keyboard: boolean, menu: boolean) {
  useEffect(() => {
    if (ref.current) {
      ref.current.style.setProperty('--virtual-keyboard-toggle-display', keyboard ? 'flex' : 'none')
      ref.current.style.setProperty('--menu-toggle-display', menu ? 'flex' : 'none')
    }
  }, [keyboard, menu, ref])
}
