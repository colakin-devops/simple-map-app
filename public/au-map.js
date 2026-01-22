(function () {
    let map = null;
    let markers = [];
    const MAX_ATTEMPTS = 5;
    let initAttempts = 0;

    window.AuAssetExplorer = {
        init: function (options) {
            const { containerId, apiBaseUrl, bubbleCallback } = options;

            function tryInit() {
                const mapContainer = document.getElementById(containerId);
                if (!mapContainer || mapContainer.offsetWidth === 0 || mapContainer.offsetHeight === 0) {
                    if (initAttempts < MAX_ATTEMPTS) {
                        initAttempts++;
                        setTimeout(tryInit, 200);
                    }
                    return;
                }

                if (typeof L === 'undefined') {
                    if (initAttempts < MAX_ATTEMPTS) {
                        initAttempts++;
                        setTimeout(tryInit, 200);
                    }
                    return;
                }

                initMap(options);
            }

            tryInit();
        }
    };

    async function initMap(options) {
        const { containerId, apiBaseUrl, bubbleCallback, tabsContainerId } = options;
        const mapContainer = document.getElementById(containerId);

        try {
            // Fetch data from backend
            const response = await fetch(`${apiBaseUrl}/api/au-map`);
            const data = await response.json();
            const { regions, properties } = data;

            // Initialize Map
            const isMobile = window.innerWidth <= 600;
            map = L.map(containerId, {
                preferCanvas: true,
                renderer: L.canvas()
            }).setView(
                isMobile ? [-37, 133] : [-30, 135],
                isMobile ? 3.2 : 4
            );

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap',
                maxZoom: 19
            }).addTo(map);

            function showProperties(props) {
                markers.forEach(m => map.removeLayer(m));
                markers = [];
                props.forEach(p => {
                    const m = L.marker(p.coords).addTo(map);
                    m.bindTooltip('<b>' + p.name + '</b><br>' + p.address);
                    m.on('click', function () {
                        window.location.href = 'https://gpt.spotinspect.tech/version-228o4/?v=property&property=' + p.id;
                    });
                    markers.push(m);
                });
            }

            function sendMessage(state) {
                if (bubbleCallback && typeof window[bubbleCallback] === 'function') {
                    window[bubbleCallback](state);
                }
                // Also postMessage for iframe compatibility if needed (though user said no iframe)
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({ type: 'mapsClick', message: state }, '*');
                }
            }

            // Create Tabs
            const tabsDiv = document.getElementById(tabsContainerId);
            if (tabsDiv) {
                tabsDiv.innerHTML = ''; // Clear existing

                // All tab
                const allTab = document.createElement('div');
                allTab.className = 'state-tab active';
                allTab.textContent = 'All';
                allTab.onclick = function () {
                    document.querySelectorAll('.state-tab').forEach(t => t.classList.remove('active'));
                    allTab.classList.add('active');
                    map.setView([-30, 135], 4);
                    showProperties(properties);
                    sendMessage('All');
                };
                tabsDiv.appendChild(allTab);

                // State tabs
                Object.keys(regions).forEach(function (state) {
                    const tab = document.createElement('div');
                    tab.className = 'state-tab';
                    tab.textContent = state;
                    tab.onclick = function () {
                        document.querySelectorAll('.state-tab').forEach(t => t.classList.remove('active'));
                        tab.classList.add('active');
                        map.setView(regions[state], 7);
                        showProperties(properties.filter(p => p.state === state));
                        sendMessage(state);
                    };
                    tabsDiv.appendChild(tab);
                });
            }

            showProperties(properties);

            // Trigger resize fix
            setTimeout(() => map.invalidateSize(), 100);

            // Hide loading if exists
            const loading = document.getElementById('map-loading');
            if (loading) loading.style.display = 'none';

        } catch (err) {
            console.error('Map initialization failed:', err);
            const container = document.getElementById(containerId);
            if (container) container.innerHTML = 'Error loading map data. Please try again later.';
        }
    }
})();
