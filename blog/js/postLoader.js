document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const contentDiv = document.getElementById('post-content');

  if (!slug) {
    console.error('Nenhum slug fornecido na URL');
    contentDiv.innerHTML =
      '<p class="text-red-600">Erro: Nenhuma postagem especificada. Verifique a URL.</p>';
    return;
  }

  try {
    const response = await fetch(`articles/${slug}.md`);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const markdown = await response.text();
    if (!markdown) {
      throw new Error('O arquivo Markdown está vazio');
    }

    // 🔹 Extrair título do markdown (# Título)
    const titleMatch = markdown.match(/^#\s+(.*)$/m);
    const postTitle = titleMatch ? titleMatch[1].trim() : slug.replace(/-/g, ' ');

    // 🔹 Atualizar <title> da página (SEO + GA)
    document.title = `${postTitle} | Marlu.me`;

    // 🔹 Renderizar markdown
    const html = marked.parse(markdown);
    contentDiv.innerHTML = html;

    // 🔹 Garantir que exista um h1
    if (!contentDiv.querySelector('h1')) {
      const h1 = document.createElement('h1');
      h1.textContent = postTitle;
      h1.className = 'text-3xl font-bold mb-6';
      contentDiv.prepend(h1);
    }

    // 🔹 Avisar que o post terminou de carregar (GA, outros scripts)
    document.dispatchEvent(
      new CustomEvent('postLoaded', {
        detail: {
          slug,
          title: postTitle
        }
      })
    );

  } catch (error) {
    console.error('Erro ao carregar o artigo:', error.message);
    contentDiv.innerHTML =
      `<p class="text-red-600">Erro ao carregar a postagem: ${error.message}. 
      Verifique se o arquivo /articles/${slug}.md existe.</p>`;
  }
});
