// 1. Accept a 'color' prop with a default value
export const Cursor = ({ color = 'white' }: { color?: string }) => {
    return (
        <svg 
            // 2. Use the color prop for the main fill attribute
            fill={color} 
            width="24px" 
            height="24px" 
            viewBox="0 0 24 24" 
            id="cursor-up-left" 
            data-name="Flat Color" 
            xmlns="http://www.w3.org/2000/svg" 
            className="icon flat-color"
            transform="matrix(-1, 0, 0, 1, 0, 0)"
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <path 
                    id="primary" 
                    d="M20.8,9.4,4.87,2.18A2,2,0,0,0,2.18,4.87h0L9.4,20.8A2,2,0,0,0,11.27,22h.25a2.26,2.26,0,0,0,2-1.8l1.13-5.58,5.58-1.13a2.26,2.26,0,0,0,1.8-2A2,2,0,0,0,20.8,9.4Z" 
                    // 3. Also use it for the path's style object
                    style={{ fill: color }}
                >
                </path>
            </g>
        </svg>
    );
}