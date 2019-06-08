let observer;
window.addEventListener('load', () => {
    let nodes = document.querySelectorAll('.animated')
    observer = new IntersectionObserver(handleIntersect);
    observeNodes(nodes)
}, false);
const observeNodes = (nodes) => {
    nodes.forEach(node => observer.observe(node))
};
const handleIntersect = (entries, observer) => {
    entries.forEach(entry => {
        let curRatio = entry.intersectionRatio, intersecting = entry.isIntersecting;
        if (intersecting && curRatio === 1) {
            handleEnter(entry.target)
        }
    })
};
const handleEnter = node => {
    let open = node.getAttribute('open'), close = node.getAttribute('close');
    node.classList.replace(close, open)
    // observer.unobserve(node)
}