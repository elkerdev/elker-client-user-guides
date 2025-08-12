// Simple search implementation with synonym support
document.addEventListener('DOMContentLoaded', function() {
    console.log('Simple search starting...');
    
    // Only run on pages with search container
    const searchContainer = document.getElementById('search-container');
    if (!searchContainer) {
        console.log('No search container found');
        return;
    }
    
    // Define synonym groups - each array contains words that are synonymous with each other
    const synonymGroups = [
        // Creation and submission actions
        ['create', 'add', 'new', 'make', 'generate', 'creating'],
        ['submit', 'send', 'file', 'save', 'complete'],
        
        // Report-related terms
        ['report', 'complaint', 'issue', 'incident', 'submission', 'case', 'matter', 'form', 'document', 'reports', 'disclosure'],
        ['note', 'notes', 'comment', 'annotation', 'remark'],
        ['tag', 'tags', 'tagging', 'label', 'category', 'attribute', 'attributes'],
        
        // Privacy and security
        ['anonymous', 'private', 'confidential', 'unnamed'],
        ['secure', 'safe', 'encrypted', 'protected', 'securemail', 'security'],
        ['password', 'code', 'pin', 'key'],
        ['two-factor', '2fa', 'tfa', 'authentication', 'mfa', 'multi-factor'],
        
        // Communication
        ['chat', 'message', 'communicate', 'contact', 'chats', 'messaging', 'conversation'],
        ['email', 'mail', 'address', 'inbox'],
        ['group', 'team', 'collective', 'shared'],
        
        // Access and authentication
        ['login', 'signin', 'access', 'enter', 'join', 'invitation', 'invite'],
        ['share', 'sharing', 'distribute', 'grant', 'permission', 'permissions'],
        ['role', 'roles', 'privilege', 'authorization', 'rights'],
        
        // Status and progress
        ['status', 'progress', 'update', 'check', 'state', 'condition'],
        ['close', 'closing', 'complete', 'finish', 'resolve', 'closed'],
        ['schedule', 'scheduling', 'calendar', 'timing', 'out-of-office', 'ooo', 'availability'],
        
        // People and organizations
        ['client', 'customer', 'organization', 'company'],
        ['partner', 'user', 'account', 'users', 'member', 'members', 'profile'],
        ['team', 'group', 'department', 'division'],
        ['manage', 'managing', 'administer', 'control', 'oversee'],
        
        // Interface elements
        ['dashboard', 'portal', 'interface', 'page'],
        ['inbox', 'mailbox', 'messages', 'notifications'],
        ['settings', 'preferences', 'configuration', 'options', 'customize', 'customization'],
        
        // Search and navigation
        ['search', 'find', 'locate', 'lookup'],
        ['view', 'see', 'display', 'show', 'displaying'],
        ['sort', 'sorting', 'order', 'arrange', 'organize', 'filter', 'filtering'],
        
        // Data modification
        ['edit', 'modify', 'change', 'update', 'updating'],
        ['delete', 'remove', 'erase'],
        ['assign', 'assigning', 'allocate', 'delegate', 'appoint'],
        
        // Export and analytics
        ['export', 'download', 'extract', 'output', 'generate'],
        ['analytics', 'statistics', 'metrics', 'data', 'insights', 'analysis'],
        ['pdf', 'document', 'file', 'format'],
        
        // Profile and personal
        ['name', 'title', 'position', 'role', 'designation'],
        ['picture', 'photo', 'image', 'avatar', 'profile']
    ];
    
    // Build bidirectional synonym map from groups
    const synonyms = {};
    synonymGroups.forEach(group => {
        group.forEach(word => {
            // For each word, all other words in the group are its synonyms
            synonyms[word] = group.filter(w => w !== word);
        });
    });
    
    // Create search UI
    searchContainer.innerHTML = `
        <div class="search-wrapper">
            <input type="text" 
                   id="search-input" 
                   class="search-input" 
                   placeholder="Search guides..."
                   autocomplete="off">
            <div id="search-results" class="search-results"></div>
        </div>
    `;
    
    // Get all guide cards
    const guideCards = document.querySelectorAll('a.guide-card[href]');
    console.log('Found', guideCards.length, 'guide cards');
    
    // Build searchable data
    const guides = [];
    guideCards.forEach(card => {
        const title = card.querySelector('h3')?.textContent || '';
        const description = card.querySelector('p')?.textContent || '';
        const href = card.getAttribute('href');
        
        guides.push({
            title: title,
            description: description,
            href: href,
            searchText: (title + ' ' + description).toLowerCase()
        });
        
        console.log('Indexed:', title);
    });
    
    // Get all search terms including synonyms
    function getSearchTerms(query) {
        const searchTerm = query.toLowerCase();
        const terms = [searchTerm];
        
        // Add synonyms if they exist
        if (synonyms[searchTerm]) {
            terms.push(...synonyms[searchTerm]);
        }
        
        console.log('Searching for:', searchTerm, 'and synonyms:', terms);
        return terms;
    }
    
    // Search function with synonym support
    function searchGuides(query) {
        const searchTerms = getSearchTerms(query);
        
        return guides.filter(guide => {
            // Check if any of the search terms (including synonyms) match
            return searchTerms.some(term => 
                guide.searchText.includes(term)
            );
        });
    }
    
    // Handle search input
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }
        
        const results = searchGuides(query);
        console.log('Search for "' + query + '" found', results.length, 'results');
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results">No guides found</div>';
        } else {
            let html = '';
            results.forEach(result => {
                // Highlight the search term
                const highlightedTitle = result.title.replace(
                    new RegExp('(' + query + ')', 'gi'), 
                    '<mark>$1</mark>'
                );
                const highlightedDesc = result.description.replace(
                    new RegExp('(' + query + ')', 'gi'), 
                    '<mark>$1</mark>'
                );
                
                html += `
                    <div class="search-result-item" style="padding: 1rem; border-bottom: 1px solid #e5e7eb;">
                        <h4 style="margin: 0 0 0.5rem 0;">
                            <a href="${result.href}" style="color: #2c6971; text-decoration: none;">
                                ${highlightedTitle}
                            </a>
                        </h4>
                        <p style="margin: 0; font-size: 0.875rem; color: #6b7280;">
                            ${highlightedDesc}
                        </p>
                    </div>
                `;
            });
            searchResults.innerHTML = html;
        }
        
        searchResults.style.display = 'block';
    });
    
    // Hide results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
    
    console.log('Simple search ready!');
});