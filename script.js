'use strict';

const draw = () => {

    const canvas = document.getElementById('canvas');
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w;
    canvas.height = h;
    const context = canvas.getContext('2d');

    let x = 0;
    let y = 0;
    let theta = 0;
    const rails = [];

    const straight = (size) => {
        const x0 = x;
        const y0 = y;
        const x1 = x0 + size * Math.cos(theta);
        const y1 = y0 + size * Math.sin(theta);
        x = x1;
        y = y1;
        rails.push({ type: 'straight', x0, y0, x1, y1 });
    };

    const curve = (orientation) => {
        const phi0 = theta - orientation * Math.PI / 2;
        const phi1 = phi0 + orientation * Math.PI / 4;
        const x0 = x;
        const y0 = y;
        const cx = x0 - Math.cos(phi0);
        const cy = y0 - Math.sin(phi0);
        const x1 = cx + Math.cos(phi1);
        const y1 = cy + Math.sin(phi1);
        x = x1;
        y = y1;
        theta = phi1 + orientation * Math.PI / 2;
        rails.push({ type: 'curve', x0, y0, x1, y1, cx, cy, phi0, phi1 });
    };

    const layout = document.getElementById('layout').value;
    layout.split('').forEach((letter) => {
        switch (letter) {
            case 'd': straight(2); break;
            case 's': straight(1); break;
            case 'h': straight(0.5); break;
            case 'q': straight(0.25); break;
            case 'l': curve(-1); break;
            case 'r': curve(+1); break;
        }
    });

    if (rails.length == 0) {
        return;
    }

    const xmin = Math.min(...rails.map((r) => Math.min(r.x0, r.x1)));
    const xmax = Math.max(...rails.map((r) => Math.max(r.x0, r.x1)));
    const ymin = Math.min(...rails.map((r) => Math.min(r.y0, r.y1)));
    const ymax = Math.max(...rails.map((r) => Math.max(r.y0, r.y1)));
    const scale = Math.min(w / (xmax - xmin + 2), h / (ymax - ymin + 2));
    context.setTransform(
        scale, 0, 0, scale,
        w / 2 - scale * (xmax + xmin) / 2,
        h / 2 - scale * (ymin + ymax) / 2,
    );
    context.lineWidth = 0.2;
    context.lineCap = 'butt';

    rails.forEach((r, i) => {
        context.strokeStyle = i % 2 == 0 ? '#0068b7' : '#7cfc00';
        switch (r.type) {
            case 'straight':
                const { x0, y0, x1, y1 } = r;
                context.beginPath();
                context.moveTo(x0, y0);
                context.lineTo(x1, y1);
                context.stroke();
                break;
            case 'curve':
                const { cx, cy, phi0, phi1 } = r;
                context.beginPath();
                context.arc(cx, cy, 1, phi0, phi1, phi0 > phi1);
                context.stroke();
                break;
        }
    })
};

window.addEventListener('resize', draw);

document.getElementById('layout').addEventListener('input', draw);
