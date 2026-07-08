// app.js
// Logika utama Web GIS Portal Kelurahan Andongsili

document.addEventListener("DOMContentLoaded", () => {
  // ================= 1. INISIALISASI DATA PROFIL HERO & STATS =================
  initProfileData();

  // ================= 2. TRANSISI NAVIGASI HERO KE PETA =================
  const btnExplore = document.getElementById("btnExplore");
  const btnBackToHero = document.getElementById("btnBackToHero");

  btnExplore.addEventListener("click", () => {
    document.body.classList.remove("hero-active");
    document.body.classList.add("map-active");
    
    // Invalidate Leaflet map size setelah transisi CSS selesai agar render ubin peta rapi
    setTimeout(() => {
      map.invalidateSize();
    }, 600);
  });

  btnBackToHero.addEventListener("click", () => {
    document.body.classList.remove("map-active");
    document.body.classList.add("hero-active");
    closeDrawer();
  });

  // ================= 3. INISIALISASI PETA LEAFLET =================
  const map = L.map("map", {
    zoomControl: false // Kita pasang zoom control custom di sisi kanan nanti
  }).setView(MAP_CONFIG.center, MAP_CONFIG.zoom);

  // Tambahkan zoom control di sudut kanan bawah agar tidak menabrak sidebar
  L.control.zoom({
    position: "bottomright"
  }).addTo(map);

  // Definisi Tile Layers (Light, Dark, & Satellite Hybrid)
  const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
  const TILE_LIGHT_URL = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  const TILE_DARK_URL = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  
  const layerLight = L.tileLayer(TILE_LIGHT_URL, {
    attribution: TILE_ATTRIBUTION,
    subdomains: "abcd",
    maxZoom: 20,
    maxNativeZoom: 18
  });

  const layerDark = L.tileLayer(TILE_DARK_URL, {
    attribution: TILE_ATTRIBUTION,
    subdomains: "abcd",
    maxZoom: 20,
    maxNativeZoom: 18
  });

  // Citra Satelit Esri + Overlay Label CartoDB
  const layerSatelliteImagery = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    maxZoom: 20,
    maxNativeZoom: 19
  });

  const layerSatelliteLabels = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png", {
    attribution: TILE_ATTRIBUTION,
    subdomains: "abcd",
    maxZoom: 20,
    maxNativeZoom: 18
  });

  const layerSatellite = L.layerGroup([layerSatelliteImagery, layerSatelliteLabels]);

  // Baca basemap dari localStorage (default 'light')
  const savedBasemap = localStorage.getItem("basemap") || "light";
  let currentTileLayer;

  if (savedBasemap === "dark") {
    currentTileLayer = layerDark;
    document.body.classList.add("dark-mode");
  } else if (savedBasemap === "satellite") {
    currentTileLayer = layerSatellite;
    document.body.classList.add("dark-mode");
  } else {
    currentTileLayer = layerLight;
    document.body.classList.remove("dark-mode");
  }

  currentTileLayer.addTo(map);

  // ================= 4. MEMUAT BATAS WILAYAH GEOJSON & MASKING (STATIC OBJECT) =================
  let boundaryLayer = null;
  let maskLayer = null;

  if (typeof KELURAHAN_BOUNDARY !== "undefined") {
    // Buat koordinat dunia (luar)
    const worldRing = [[-90, -360], [-90, 360], [90, 360], [90, -360]];
    const maskRings = [worldRing];

    // Konversi koordinat GeoJSON (lng, lat) ke Leaflet (lat, lng) untuk lubang (hole) mask
    KELURAHAN_BOUNDARY.features.forEach(feature => {
      const geom = feature.geometry;
      if (geom.type === "Polygon") {
        geom.coordinates.forEach(ring => {
          const latLngs = ring.map(coord => [coord[1], coord[0]]);
          maskRings.push(latLngs);
        });
      } else if (geom.type === "MultiPolygon") {
        geom.coordinates.forEach(poly => {
          poly.forEach(ring => {
            const latLngs = ring.map(coord => [coord[1], coord[0]]);
            maskRings.push(latLngs);
          });
        });
      }
    });

    // Buat layer mask dengan warna yang sesuai tema saat ini
    const isDarkTheme = savedBasemap === "dark" || savedBasemap === "satellite";
    maskLayer = L.polygon(maskRings, {
      color: "transparent",
      weight: 0,
      fillColor: isDarkTheme ? "#020617" : "#0f172a",
      fillOpacity: isDarkTheme ? 0.4 : 0.25,
      interactive: false // Membantu agar interaksi klik/hover tidak terganggu mask
    }).addTo(map);

    // Buat garis batas merah di atas mask
    boundaryLayer = L.geoJSON(KELURAHAN_BOUNDARY, {
      style: {
        color: "#ef4444",      // Warna merah
        weight: 2.5,
        dashArray: "6, 6",     // Garis putus-putus
        fillColor: "transparent",
        fillOpacity: 0
      }
    }).addTo(map);

    console.log("Batas wilayah GeoJSON & Masking berhasil dimuat dari data.js.");
  } else {
    console.warn("Pemberitahuan: Variabel KELURAHAN_BOUNDARY tidak ditemukan.");
  }

  // ================= 5. MENGELOLA PENANDA (MARKER) LOKASI =================
  // Pemetaan ikon kategori
  const CATEGORY_META = {
    "Pemerintahan": { icon: "fa-building-columns", color: "#0284c7" },
    "Pendidikan": { icon: "fa-graduation-cap", color: "#8b5cf6" },
    "Wisata": { icon: "fa-mountain-sun", color: "#10b981" },
    "Tempat Ibadah": { icon: "fa-mosque", color: "#f59e0b" },
    "UMKM": { icon: "fa-store", color: "#ec4899" },
    "Kesehatan": { icon: "fa-notes-medical", color: "#ef4444" }
  };

  const DEFAULT_META = { icon: "fa-location-dot", color: "#64748b" };
  
  let markersList = []; // Menyimpan semua marker untuk manipulasi filter/search
  let activeSelectedMarker = null; // Marker yang sedang diklik/aktif

  // Render Marker ke Peta
  function renderMarkers() {
    // Bersihkan marker lama jika ada
    markersList.forEach(m => map.removeLayer(m.leafletMarker));
    markersList = [];

    LOCATIONS.forEach(loc => {
      const meta = CATEGORY_META[loc.category] || DEFAULT_META;
      
      // Buat ikon kustom HTML + CSS
      const customIcon = L.divIcon({
        html: `<div class="marker-pin" style="background-color: ${meta.color};">
                 <i class="fa-solid ${meta.icon}"></i>
               </div>`,
        className: "custom-div-icon",
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -32]
      });

      // Buat marker Leaflet
      const marker = L.marker([loc.latitude, loc.longitude], { icon: customIcon });
      
      // Tambahkan popup interaktif
      const popupContent = `
        <div class="custom-popup">
          <div class="popup-category" style="color: ${meta.color};">${loc.category}</div>
          <div class="popup-title">${loc.name}</div>
          <button class="popup-btn" data-id="${loc.id}">
            <span>Lihat Detail</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      `;
      marker.bindPopup(popupContent);

      // Event listener saat penanda diklik
      marker.on("click", () => {
        highlightMarker(marker);
        showLocationDetails(loc, marker);
      });

      // Tambahkan ke peta
      marker.addTo(map);

      // Simpan ke daftar
      markersList.push({
        data: loc,
        leafletMarker: marker,
        visible: true
      });
    });
  }

  renderMarkers();

  // Event delegation untuk klik tombol di dalam Leaflet popup
  map.on("popupopen", (e) => {
    const btnDetail = e.popup.getElement().querySelector(".popup-btn");
    if (btnDetail) {
      btnDetail.addEventListener("click", (evt) => {
        const locId = parseInt(evt.currentTarget.getAttribute("data-id"));
        const found = markersList.find(m => m.data.id === locId);
        if (found) {
          highlightMarker(found.leafletMarker);
          showLocationDetails(found.data, found.leafletMarker);
          found.leafletMarker.closePopup();
        }
      });
    }
  });

  // ================= 6. SLIDING DRAWER DETAIL LOKASI =================
  const detailDrawer = document.getElementById("detailDrawer");
  const drawerBody = document.getElementById("drawerBody");
  const btnCloseDrawer = document.getElementById("btnCloseDrawer");

  function showLocationDetails(location, leafletMarker) {
    const meta = CATEGORY_META[location.category] || DEFAULT_META;
    
    drawerBody.innerHTML = `
      <div class="detail-image" style="background-image: url('${location.image}');"></div>
      
      <span class="detail-category-badge" style="background-color: ${meta.color}25; color: ${meta.color};">
        <i class="fa-solid ${meta.icon}"></i> ${location.category}
      </span>
      
      <h2 class="detail-title">${location.name}</h2>
      <p class="detail-desc">${location.description}</p>
      
      <div class="detail-info-list">
        <div class="info-item">
          <i class="fa-solid fa-map-pin"></i>
          <div>
            <span class="info-item-label">Alamat</span>
            <span class="info-item-value">${location.address}</span>
          </div>
        </div>
        <div class="info-item">
          <i class="fa-solid fa-phone"></i>
          <div>
            <span class="info-item-label">Kontak</span>
            <span class="info-item-value">${location.contact}</span>
          </div>
        </div>
        <div class="info-item">
          <i class="fa-solid fa-compass"></i>
          <div>
            <span class="info-item-label">Koordinat</span>
            <span class="info-item-value">${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}</span>
          </div>
        </div>
      </div>
      
      <div class="detail-actions">
        <a href="https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}" 
           target="_blank" 
           class="btn btn-primary btn-route">
          <i class="fa-solid fa-route"></i>
          <span>Petunjuk Arah (Google Maps)</span>
        </a>
      </div>
    `;
    
    detailDrawer.classList.add("active");
    
    // Collapse sidebar on mobile when drawer is shown
    const floatingSidebar = document.getElementById("floatingSidebar");
    if (floatingSidebar && window.innerWidth <= 768) {
      floatingSidebar.classList.remove("expanded");
    }
    
    map.panTo([location.latitude, location.longitude]);
  }

  function highlightMarker(marker) {
    // Reset marker aktif sebelumnya
    if (activeSelectedMarker) {
      const el = activeSelectedMarker.getElement();
      if (el) el.classList.remove("active");
    }
    
    // Set marker aktif baru
    activeSelectedMarker = marker;
    const el = marker.getElement();
    if (el) el.classList.add("active");
  }

  function closeDrawer() {
    detailDrawer.classList.remove("active");
    if (activeSelectedMarker) {
      const el = activeSelectedMarker.getElement();
      if (el) el.classList.remove("active");
      activeSelectedMarker = null;
    }
  }

  btnCloseDrawer.addEventListener("click", closeDrawer);

  // ================= 7. SISTEM PENCARIAN REAL-TIME =================
  const searchInput = document.getElementById("searchInput");
  const btnClearSearch = document.getElementById("btnClearSearch");

  searchInput.addEventListener("input", (e) => {
    const val = e.target.value.toLowerCase().trim();
    
    if (val !== "") {
      btnClearSearch.classList.add("active");
    } else {
      btnClearSearch.classList.remove("active");
    }

    filterLocations();
  });

  btnClearSearch.addEventListener("click", () => {
    searchInput.value = "";
    btnClearSearch.classList.remove("active");
    filterLocations();
  });

  // ================= 8. SISTEM FILTER KATEGORI =================
  const filterGroup = document.getElementById("filterGroup");
  const activeCategories = new Set(); // Kategori yang sedang dicentang (kosong berarti tampilkan semua)

  // Ambil semua kategori unik dari data lokasi
  const categories = [...new Set(LOCATIONS.map(l => l.category))];

  // Render checkbox filter dinamis
  categories.forEach(cat => {
    const meta = CATEGORY_META[cat] || DEFAULT_META;
    
    const filterItem = document.createElement("div");
    filterItem.className = "filter-checkbox active"; // Awalnya semua aktif
    filterItem.setAttribute("data-category", cat);
    filterItem.innerHTML = `
      <div class="checkbox-label">
        <i class="fa-solid ${meta.icon}" style="color: ${meta.color};"></i>
        <span>${cat}</span>
      </div>
      <div class="checkbox-indicator">
        <i class="fa-solid fa-check"></i>
      </div>
    `;

    // Pasang event listener click
    filterItem.addEventListener("click", () => {
      const isSelected = filterItem.classList.toggle("active");
      
      if (isSelected) {
        activeCategories.add(cat);
      } else {
        activeCategories.delete(cat);
      }
      
      filterLocations();
    });

    filterGroup.appendChild(filterItem);
    activeCategories.add(cat); // Tambah ke set kategori aktif
  });

  // Fungsi Filter Gabungan (Search + Kategori)
  function filterLocations() {
    const searchVal = searchInput.value.toLowerCase().trim();
    
    markersList.forEach(item => {
      const matchSearch = item.data.name.toLowerCase().includes(searchVal) || 
                          item.data.description.toLowerCase().includes(searchVal) ||
                          item.data.address.toLowerCase().includes(searchVal);
                          
      const matchCategory = activeCategories.has(item.data.category);

      if (matchSearch && matchCategory) {
        if (!item.visible) {
          item.leafletMarker.addTo(map);
          item.visible = true;
        }
      } else {
        if (item.visible) {
          map.removeLayer(item.leafletMarker);
          item.visible = false;
        }
      }
    });

    // Jika drawer detail sedang aktif namun markernya sekarang disembunyikan filter, tutup drawer
    if (activeSelectedMarker) {
      const currentActiveData = markersList.find(m => m.leafletMarker === activeSelectedMarker);
      if (currentActiveData && !currentActiveData.visible) {
        closeDrawer();
      }
    }
  }

  // ================= 9. SISTEM PILIHAN BASEMAP & SINKRONISASI TEMA =================
  const basemapCards = document.querySelectorAll(".basemap-card");
  
  // Set status awal tombol switcher berdasarkan localStorage
  basemapCards.forEach(card => {
    if (card.getAttribute("data-basemap") === savedBasemap) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });

  basemapCards.forEach(card => {
    card.addEventListener("click", () => {
      const selected = card.getAttribute("data-basemap");
      
      // Simpan ke localStorage
      localStorage.setItem("basemap", selected);
      
      // Update visual active card
      basemapCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      
      // Ganti layer peta & sinkronkan tema UI
      let newLayer;
      const isDark = selected === "dark" || selected === "satellite";
      if (selected === "dark") {
        newLayer = layerDark;
        document.body.classList.add("dark-mode");
      } else if (selected === "satellite") {
        newLayer = layerSatellite;
        document.body.classList.add("dark-mode"); // Satellite terlihat premium dengan tema gelap
      } else {
        newLayer = layerLight;
        document.body.classList.remove("dark-mode");
      }
      
      if (maskLayer) {
        maskLayer.setStyle({
          fillColor: isDark ? "#020617" : "#0f172a",
          fillOpacity: isDark ? 0.4 : 0.25
        });
      }
      
      swapTileLayer(newLayer);
    });
  });

  function swapTileLayer(newLayer) {
    map.removeLayer(currentTileLayer);
    currentTileLayer = newLayer;
    currentTileLayer.addTo(map);
  }

  // ================= 9.5 KOORDINAT PICKER (DEVELOPER HELPER) =================
  // Hanya aktif secara lokal (file://, localhost) atau jika URL mengandung '?dev=true' / '?admin=true'
  const urlParams = new URLSearchParams(window.location.search);
  const isDevMode = urlParams.has("dev") || urlParams.has("admin") || 
                    window.location.hostname === "localhost" || 
                    window.location.hostname === "127.0.0.1" || 
                    window.location.protocol === "file:";

  if (isDevMode) {
    console.log("Developer Mode Aktif: Klik pada peta untuk menyalin format objek lokasi baru.");
    
    map.on("click", (e) => {
      // Abaikan jika klik dilakukan pada marker
      if (e.originalEvent && e.originalEvent.target && e.originalEvent.target.closest('.leaflet-marker-icon')) return;

      const lat = e.latlng.lat.toFixed(6);
      const lng = e.latlng.lng.toFixed(6);
      
      L.popup()
        .setLatLng(e.latlng)
        .setContent(`
          <div class="custom-popup" style="min-width: 250px; font-family: var(--font-body); padding: 0.75rem;">
            <div class="popup-category" style="color: var(--accent-color); font-weight: 700; font-size: 0.7rem; letter-spacing: 0.05em; text-transform: uppercase;">
              <i class="fa-solid fa-code"></i> Developer Mode
            </div>
            <div class="popup-title" style="font-size: 0.85rem; margin-top: 0.25rem; font-weight: 600; color: var(--text-main);">
              Klik Koordinat: <code style="background: var(--accent-light); padding: 0.15rem 0.35rem; border-radius: 4px; color: var(--accent-color); font-size: 0.75rem;">${lat}, ${lng}</code>
            </div>
            <p style="font-size: 0.725rem; color: var(--text-muted); margin-top: 0.25rem; line-height: 1.3;">
              Salin objek di bawah ini untuk ditambahkan ke daftar lokasi di <strong>data.js</strong>:
            </p>
            <textarea readonly style="width: 100%; height: 95px; font-family: monospace; font-size: 0.7rem; margin-top: 0.5rem; padding: 0.35rem; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-main); resize: none; outline: none; cursor: pointer;" 
              onclick="this.select(); document.execCommand('copy'); alert('Objek lokasi disalin ke clipboard!');"
            >{
  id: ${LOCATIONS.length + 1},
  name: "Fasilitas Baru",
  category: "Pemerintahan",
  latitude: ${lat},
  longitude: ${lng},
  description: "Deskripsi singkat.",
  address: "Alamat.",
  image: "https://images.unsplash.com/photo-1541829019-2188201b83a0?auto=format&fit=crop&w=600&q=80",
  contact: "-"
}</textarea>
            <div style="font-size: 0.625rem; color: var(--text-light); text-align: right; margin-top: 0.25rem;">
              *Klik kotak di atas untuk menyalin langsung
            </div>
          </div>
        `)
        .openOn(map);
    });
  }

  // ================= 9.7 INTERAKSI MOBILE (BOTTOM SHEET & ACCORDION) =================
  // Toggle status accordion (Filter, Basemap, Legenda)
  document.querySelectorAll(".collapsible-header").forEach(header => {
    header.addEventListener("click", () => {
      const section = header.parentElement;
      section.classList.toggle("collapsed");
      
      // Paksa map.invalidateSize() jika layout berubah agar Leaflet memuat ubin dengan benar
      setTimeout(() => {
        map.invalidateSize();
      }, 300);
    });
  });

  // Collapse basemap & legenda secara default jika di perangkat seluler (mobile)
  if (window.innerWidth <= 768) {
    const basemapSection = document.getElementById("headerBasemap")?.parentElement;
    const legendSection = document.getElementById("headerLegend")?.parentElement;
    if (basemapSection) basemapSection.classList.add("collapsed");
    if (legendSection) legendSection.classList.add("collapsed");
  }

  // Pengelolaan status Bottom Sheet Sidebar
  const floatingSidebar = document.getElementById("floatingSidebar");
  const sidebarDragHandle = document.getElementById("sidebarDragHandle");

  if (floatingSidebar && sidebarDragHandle) {
    // Klik pada drag handle akan membuka/menutup sidebar
    sidebarDragHandle.addEventListener("click", () => {
      floatingSidebar.classList.toggle("expanded");
    });

    // Mengetik/Fokus pada search input otomatis membuka sidebar secara penuh
    if (searchInput) {
      searchInput.addEventListener("focus", () => {
        floatingSidebar.classList.add("expanded");
      });
    }
  }

  // Menutup drawer & collapse sidebar ketika mengklik area kosong peta
  map.on("click", (e) => {
    // Abaikan jika klik dilakukan pada marker
    if (e.originalEvent && e.originalEvent.target && e.originalEvent.target.closest('.leaflet-marker-icon')) return;

    closeDrawer();
    if (floatingSidebar) {
      floatingSidebar.classList.remove("expanded");
    }
  });

  // ================= 10. HELPER UNTUK MENGISI DATA PROFIL =================
  function initProfileData() {
    document.getElementById("heroTitle").textContent = KELURAHAN_PROFILE.name;
    document.getElementById("heroDesc").textContent = KELURAHAN_PROFILE.description;
    document.getElementById("heroBg").style.backgroundImage = `url('${KELURAHAN_PROFILE.heroImage}')`;
    
    document.getElementById("statPop").textContent = KELURAHAN_STATS.population;
    document.getElementById("statKK").textContent = KELURAHAN_STATS.families;
    document.getElementById("statRW").textContent = KELURAHAN_STATS.rwCount;
    document.getElementById("statArea").textContent = KELURAHAN_STATS.areaSize;
  }
});
