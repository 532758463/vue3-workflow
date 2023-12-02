import lint from '@antfu/eslint-config'
import unocss from '@unocss/eslint-plugin'

export default lint(
  {},
  unocss.configs.flat,
)
