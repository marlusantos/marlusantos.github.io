document.addEventListener('DOMContentLoaded', async () => {
  const slug = new URLSearchParams(window.location.search).get('slug');
  const contentDiv = document.getElementById('post-content');

  // Verifica se o slug está presente
  if (!slug) {
    console.error('Nenhum slug fornecido na URL');
    contentDiv.innerHTML = '<p class="text-red-600">Erro: Nenhuma postagem especificada. Verifique a URL.</p>';
    return;
  }

  console.log(`Tentando carregar o artigo: articles/${slug}.md`);

  try {
    const response = await fetch(`articles/${slug}.md`);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
    }
    const markdown = await response.text();
    if (!markdown) {
      throw new Error('O arquivo Markdown está vazio');
    }
    console.log('Markdown carregado com sucesso:', markdown.substring(0, 50) + '...');
    const html = marked.parse(markdown);
    contentDiv.innerHTML = html;
  } catch (error) {
    console.error('Erro ao carregar o artigo:', error.message);
    contentDiv.innerHTML = `<p class="text-red-600">Erro ao carregar a postagem: ${error.message}. Verifique se o arquivo /articles/${slug}.md existe.</p>`;
  }
});