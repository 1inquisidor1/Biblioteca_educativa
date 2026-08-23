
// Handle broken/placeholder links
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    
    // Intercept links to missing author/blog pages
    const missingPages = [
        'dr-turing.html', 'stephen-hawking.html', 'euclides.html',
        'maria-caldas.html', 'laura-rey.html', 'gustavo-mendoza.html',
        'como-aprender-programacion.html', 'metodos-de-estudio.html',
        'fisica-cuantica-para-principiantes.html', 'herramientas-gratuitas-pdfs.html',
        'aprender-matematicas-con-juegos.html', 'lecturas-esenciales-historia.html'
    ];
    
    if (missingPages.some(page => href.includes(page))) {
        e.preventDefault();
        alert('Página en construcción. Pronto disponible.');
        return false;
    }
});
