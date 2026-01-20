fetch('/api/items')
  .then(response => response.json())
  .then(items => {
    const list = document.getElementById('item-list')

    items.forEach(item => {
      const li = document.createElement('li')
      li.textContent = `${item.name} – $${item.price}`
      list.appendChild(li)
    })
  })
  .catch(err => {
    console.error('Error loading items:', err)
  })

