// Sample initial monuments data with updated image URLs
let monuments = [
    { 
        id: 1, 
        name: "Taj Mahal", 
        desc: "A magnificent white marble mausoleum", 
        city: "Agra",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/800px-Taj_Mahal_%28Edited%29.jpeg" 
    },
    { 
        id: 2, 
        name: "Eiffel Tower", 
        desc: "Iconic iron lattice tower", 
        city: "Paris",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/800px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg" 
    },
    { 
        id: 3, 
        name: "Statue of Liberty", 
        desc: "Symbol of freedom and democracy", 
        city: "New York",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Statue_of_Liberty_7.jpg/800px-Statue_of_Liberty_7.jpg" 
    },
    { 
        id: 4, 
        name: "Great Wall of China", 
        desc: "Ancient fortification spanning thousands of miles", 
        city: "Various",
        image: "https://whc.unesco.org/uploads/thumbs/site_0438_0035-750-750-20241024162522.jpg" 
    },
    { 
        id: 5, 
        name: "Colosseum", 
        desc: "Historic amphitheater of Roman gladiators", 
        city: "Rome",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Colosseum_in_Rome%2C_Italy_-_April_2007.jpg/800px-Colosseum_in_Rome%2C_Italy_-_April_2007.jpg" 
    },
    { 
        id: 6, 
        name: "Machu Picchu", 
        desc: "Mysterious Incan city in the Andes", 
        city: "Various",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/80_-_Machu_Picchu_-_Juin_2009_-_edit.2.jpg/1024px-80_-_Machu_Picchu_-_Juin_2009_-_edit.2.jpg" 
    },
    { 
        id: 7, 
        name: "Pyramids of Giza", 
        desc: "Ancient wonders of the world", 
        city: "Giza",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/All_Gizah_Pyramids.jpg/800px-All_Gizah_Pyramids.jpg" 
    },
    { 
        id: 8, 
        name: "Christ the Redeemer", 
        desc: "Iconic statue overlooking Rio", 
        city: "Rio de Janeiro",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Aerial_view_of_the_Statue_of_Christ_the_Redeemer.jpg/800px-Aerial_view_of_the_Statue_of_Christ_the_Redeemer.jpg" 
    },
    { 
        id: 9, 
        name: "Petra", 
        desc: "Rock-carved city of archaeological wonder", 
        city: "Various",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Treasury_petra_crop.jpeg/800px-Treasury_petra_crop.jpeg" 
    }
];

const grid = document.getElementById('monumentsGrid');
const modal = document.getElementById('monumentModal');
const form = document.getElementById('monumentForm');
const modalTitle = document.getElementById('modalTitle');
const searchInput = document.getElementById('searchInput');
let editingId = null;

// Render monuments with error handling for images
function renderMonuments(monumentsToShow = monuments) {
    grid.innerHTML = '';
    monumentsToShow.forEach(monument => {
        const card = document.createElement('div');
        card.className = 'monument-card';
        card.innerHTML = `
            <img src="${monument.image}" alt="${monument.name}" onerror="this.src='https://via.placeholder.com/300x200?text=${monument.name}'; this.onerror=null;">
            <div class="monument-info">
                <h3>${monument.name}</h3>
                <p>${monument.desc}</p>
                <p><strong>City:</strong> ${monument.city}</p>
            </div>
            <button class="delete-btn" data-id="${monument.id}">Delete</button>
        `;
        card.querySelector('img').addEventListener('click', () => editMonument(monument.id));
        card.querySelector('.delete-btn').addEventListener('click', () => deleteMonument(monument.id));
        grid.appendChild(card);
    });
}

// Add/Edit modal handling
document.getElementById('addBtn').addEventListener('click', () => {
    editingId = null;
    modalTitle.textContent = 'Add New Monument';
    form.reset();
    modal.style.display = 'block';
});

document.querySelector('.close').addEventListener('click', () => {
    modal.style.display = 'none';
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newMonument = {
        id: editingId || Date.now(),
        name: document.getElementById('monumentName').value,
        desc: document.getElementById('monumentDesc').value,
        city: document.getElementById('monumentCity').value,
        image: "https://via.placeholder.com/300x200?text=" + document.getElementById('monumentName').value // Default placeholder for new monuments
    };
    
    if (editingId) {
        monuments = monuments.map(m => m.id === editingId ? newMonument : m);
    } else {
        monuments.push(newMonument);
    }
    
    modal.style.display = 'none';
    renderMonuments();
});

// Edit monument
function editMonument(id) {
    const monument = monuments.find(m => m.id === id);
    editingId = id;
    modalTitle.textContent = 'Edit Monument';
    document.getElementById('monumentName').value = monument.name;
    document.getElementById('monumentDesc').value = monument.desc;
    document.getElementById('monumentCity').value = monument.city;
    modal.style.display = 'block';
}

// Delete monument
function deleteMonument(id) {
    if (confirm('Are you sure you want to delete this monument?')) {
        monuments = monuments.filter(m => m.id !== id);
        renderMonuments();
    }
}

// Search functionality
document.getElementById('searchBtn').addEventListener('click', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredMonuments = monuments.filter(m => 
        m.name.toLowerCase().includes(searchTerm)
    );
    renderMonuments(filteredMonuments);
});

// Initial render
renderMonuments();