import * as React from "react"
const SvgComponent = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        fill="none"
        {...props}
    >
        <path
            fill="#EEE"
            d="M23.947 1.029a.75.75 0 0 0-.975-.975L1.152 8.782H1.15l-.678.27a.75.75 0 0 0-.123 1.33l.615.39.002.004 7.492 4.767 4.767 7.492.003.003.39.615a.75.75 0 0 0 1.33-.124l9-22.5Zm-2.75 2.835-11.24 11.24-.323-.506a.75.75 0 0 0-.23-.231l-.508-.323 11.241-11.24 1.767-.707-.705 1.767h-.001Z"
        />
    </svg>
)
export { SvgComponent as SendIcon }
