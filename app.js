// app.js
// Logika utama Web GIS Portal Kelurahan Andongsili

document.addEventListener("DOMContentLoaded", () => {
  // ================= 1. INISIALISASI DATA PROFIL HERO & STATS =================
  initProfileData();

  // ================= 2. TRANSISI NAVIGASI HERO KE PETA =================
  const btnExplore = document.getElementById("btnExplore");
  const btnBackToHero = document.getElementById("btnBackToHero");

  // Check if ?map is in URL query parameters to bypass hero page
  const urlParams = new URLSearchParams(window.location.search);
  const showMapDirectly = urlParams.has('map');

  if (showMapDirectly) {
    document.body.classList.remove("hero-active");
    document.body.classList.add("map-active");
  }

  btnExplore.addEventListener("click", () => {
    document.body.classList.remove("hero-active");
    document.body.classList.add("map-active");
    
    // Invalidate Leaflet map size almost immediately (50ms delay) and trigger the zoom fly-in.
    // This allows the map zoom-in animation to occur concurrently with the hero section sliding up,
    // reducing total transition wait time significantly.
    setTimeout(() => {
      map.invalidateSize();
      map.flyTo(MAP_CONFIG.center, MAP_CONFIG.zoom, {
        duration: 1.0,
        easeLinearity: 0.25
      });
    }, 50);
  });

  btnBackToHero.addEventListener("click", () => {
    const isMobile = window.innerWidth <= 768;
    const isDrawerOpen = isMobile 
      ? (detailDrawer.classList.contains("peeking") || detailDrawer.classList.contains("expanded"))
      : detailDrawer.classList.contains("active");

    if (isDrawerOpen) {
      closeDrawer();
      searchInput.value = "";
      btnClearSearch.classList.remove("active");
      filterLocations();
    } else {
      document.body.classList.remove("map-active");
      document.body.classList.add("hero-active");
      
      // Reset map zoom level instantly behind the scenes so it's ready for the next entrance
      setTimeout(() => {
        map.setView(MAP_CONFIG.center, MAP_CONFIG.zoom - 1.5, { animate: false });
      }, 50);
    }
  });

  // ================= 3. INISIALISASI PETA LEAFLET =================
  const map = L.map("map", {
    zoomControl: false, // Kita pasang zoom control custom di sisi kanan nanti
    renderer: L.svg({ padding: 2.0 }) // Pre-render vectors far outside viewport to avoid zoom clipping
  }).setView(MAP_CONFIG.center, MAP_CONFIG.zoom - 1.5);

  if (showMapDirectly) {
    setTimeout(() => {
      map.invalidateSize();
      map.flyTo(MAP_CONFIG.center, MAP_CONFIG.zoom, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }, 150);
  }

  // Tambahkan zoom control di sudut kanan bawah agar tidak menabrak sidebar
  L.control.zoom({
    position: "bottomright"
  }).addTo(map);

  // Logika Skala Marker Dinamis & Visibilitas Label berdasarkan Zoom Level Peta
  function updateMarkerScaleAndLabels() {
    const currentZoom = map.getZoom();
    const baseZoom = 15; // Zoom default di data.js
    // Hitung skala: makin zoom out (<15) makin kecil, makin zoom in (>15) makin besar
    // Dibatasi antara 0.45 (sangat kecil saat zoom out jauh) hingga 1.3 (saat zoom in dekat)
    const scale = Math.max(0.45, Math.min(1.3, 1 + (currentZoom - baseZoom) * 0.12));
    const container = map.getContainer();
    container.style.setProperty('--marker-zoom-scale', scale);

    // Tampilkan label nama jika zoom level >= 17
    if (currentZoom >= 17) {
      container.classList.add("show-labels");
    } else {
      container.classList.remove("show-labels");
    }
  }
  
  map.on("zoomend", updateMarkerScaleAndLabels);
  updateMarkerScaleAndLabels(); // Jalankan sekali di awal untuk inisialisasi skala

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
               </div>
               <span class="marker-label">${loc.name}</span>`,
        className: "custom-div-icon",
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -22]
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

  // Helper to center the map on a coordinate while offsetting for active UI elements (sidebar/drawer)
  function panToWithOffset(latlng) {
    const currentZoom = map.getZoom();
    const targetPoint = map.project(latlng, currentZoom);

    let offsetX = 0;
    let offsetY = 0;

    if (window.innerWidth <= 768) {
      // Mobile Layout: bottom sheet (detailDrawer) covers the bottom of the screen
      const isMobileActive = detailDrawer.classList.contains("peeking") || detailDrawer.classList.contains("expanded");
      if (isMobileActive) {
        const visibleHeight = window.innerHeight - (detailDrawer.classList.contains("expanded") ? detailDrawer.offsetHeight : 280);
        const offsetPixels = (window.innerHeight - visibleHeight) / 2;
        offsetY = offsetPixels;
      }
    } else {
      // Desktop Layout: detailDrawer is on the left (width 380px, left margin 20px)
      const drawerWidth = detailDrawer.classList.contains("active") ? detailDrawer.offsetWidth : 0;
      offsetX = drawerWidth > 0 ? - (drawerWidth + 20) / 2 : 0;
    }

    targetPoint.x += offsetX;
    targetPoint.y += offsetY;

    const targetLatLng = map.unproject(targetPoint, currentZoom);
    map.panTo(targetLatLng);
  }

  function showLocationDetails(location, leafletMarker) {
    const meta = CATEGORY_META[location.category] || DEFAULT_META;
    
    const hoursHtml = (location.hours && location.hours !== "-") ? `
      <div class="info-item">
        <i class="fa-solid fa-clock"></i>
        <div>
          <span class="info-item-label">Jam Operasional</span>
          <span class="info-item-value">${location.hours}</span>
        </div>
      </div>
    ` : "";
    
    const mapsUrl = location.googleMapsUrl || 
      (location.name ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name + ', Andongsili, Wonosobo')}` 
                     : `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`);

    // Populate drawer body
    drawerBody.innerHTML = `
      <!-- Banner Image -->
      <div class="drawer-banner" style="background-image: url('${location.image}');"></div>

      <div class="drawer-content-padding">
        <!-- Header Info -->
        <div class="drawer-header-info">
          <h2 class="detail-title">${location.name}</h2>
          
          <span class="detail-category-badge" style="background-color: ${meta.color}25; color: ${meta.color};">
            <i class="fa-solid ${meta.icon}"></i> ${location.category}
          </span>
        </div>

        <!-- Action Button Row -->
        <div class="detail-action-row">
          <a href="${mapsUrl}" target="_blank" class="btn-route-wide">
            <i class="fa-solid fa-diamond-turn-right"></i>
            <span>Petunjuk Rute (Google Maps)</span>
          </a>
        </div>

        <!-- Description -->
        <p class="detail-desc">${location.description}</p>

        <!-- Info List -->
        <div class="detail-info-list">
          <div class="info-item">
            <i class="fa-solid fa-map-pin"></i>
            <div>
              <span class="info-item-label">Alamat</span>
              <span class="info-item-value">${location.address}</span>
            </div>
          </div>
          ${hoursHtml}
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
      </div>
    `;
    
    // Sync Search Input with location name
    searchInput.value = location.name;
    btnClearSearch.classList.add("active");

    if (window.innerWidth <= 768) {
      detailDrawer.classList.remove("closed", "expanded");
      detailDrawer.classList.add("peeking");
      detailDrawer.style.transform = "";
    } else {
      detailDrawer.classList.add("active");
    }
    
    panToWithOffset([location.latitude, location.longitude]);
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
    const isMobile = window.innerWidth <= 768;
    const isCurrentlyOpen = isMobile 
      ? (detailDrawer.classList.contains("peeking") || detailDrawer.classList.contains("expanded"))
      : detailDrawer.classList.contains("active");

    if (isCurrentlyOpen && activeSelectedMarker) {
      map.panTo(activeSelectedMarker.getLatLng());
    }

    if (isMobile) {
      detailDrawer.classList.remove("peeking", "expanded");
      detailDrawer.classList.add("closed");
      detailDrawer.style.transform = "";
    } else {
      detailDrawer.classList.remove("active");
    }

    if (activeSelectedMarker) {
      const currentActiveData = markersList.find(m => m.leafletMarker === activeSelectedMarker);
      if (currentActiveData && searchInput.value === currentActiveData.data.name) {
        searchInput.value = "";
        btnClearSearch.classList.remove("active");
        filterLocations();
      }

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
    closeDrawer();
  });

  // ================= 8. SISTEM FILTER KATEGORI =================
  const filterGroup = document.getElementById("filterGroup");
  const activeCategories = new Set(); // Kategori yang sedang aktif

  // Ambil semua kategori unik dari data lokasi
  const categories = [...new Set(LOCATIONS.map(l => l.category))];

  // Tambahkan semua kategori ke set aktif awal
  categories.forEach(cat => activeCategories.add(cat));

  // Render tombol pil "Semua" terlebih dahulu
  const allPill = document.createElement("button");
  allPill.className = "category-pill active"; // Aktif secara default
  allPill.id = "pill-all";
  allPill.innerHTML = `
    <i class="fa-solid fa-border-all"></i>
    <span>Semua</span>
  `;
  allPill.addEventListener("click", () => {
    // Aktifkan kembali semua kategori
    categories.forEach(cat => activeCategories.add(cat));
    
    // Update styling semua pil
    document.querySelectorAll(".category-pill").forEach(p => p.classList.remove("active"));
    allPill.classList.add("active");
    
    filterLocations();
  });
  filterGroup.appendChild(allPill);

  // Render tombol pil kategori dinamis
  categories.forEach(cat => {
    const meta = CATEGORY_META[cat] || DEFAULT_META;
    
    const pill = document.createElement("button");
    pill.className = "category-pill";
    pill.setAttribute("data-category", cat);
    pill.innerHTML = `
      <i class="fa-solid ${meta.icon}" style="color: ${meta.color};"></i>
      <span>${cat}</span>
    `;

    // Pasang event listener click
    pill.addEventListener("click", () => {
      const wasActive = pill.classList.contains("active");
      
      // Reset status semua pil
      document.querySelectorAll(".category-pill").forEach(p => p.classList.remove("active"));
      
      if (wasActive) {
        // Jika sebelumnya aktif, kembalikan ke "Semua"
        categories.forEach(catName => activeCategories.add(catName));
        allPill.classList.add("active");
      } else {
        // Jika tidak aktif, aktifkan hanya kategori ini
        activeCategories.clear();
        activeCategories.add(cat);
        pill.classList.add("active");
      }
      
      filterLocations();
    });

    filterGroup.appendChild(pill);
  });

  // ================= 8.1 DESKTOP DRAG TO SCROLL & MOUSE WHEEL FOR CATEGORIES =================
  if (filterGroup) {
    // 1. Mouse Wheel Scroll (Convert vertical scroll to horizontal scroll)
    filterGroup.addEventListener("wheel", (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        filterGroup.scrollLeft += e.deltaY * 1.2; // Adjust scroll speed multiplier if needed
      }
    }, { passive: false });

    // 2. Click and Drag gesture to scroll
    let isDown = false;
    let startX;
    let scrollLeft;
    let hasMoved = false;

    filterGroup.addEventListener("mousedown", (e) => {
      isDown = true;
      hasMoved = false;
      filterGroup.classList.add("dragging");
      startX = e.pageX - filterGroup.offsetLeft;
      scrollLeft = filterGroup.scrollLeft;
    });

    filterGroup.addEventListener("mouseleave", () => {
      isDown = false;
      filterGroup.classList.remove("dragging");
    });

    filterGroup.addEventListener("mouseup", () => {
      isDown = false;
      filterGroup.classList.remove("dragging");
    });

    filterGroup.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - filterGroup.offsetLeft;
      const walk = (x - startX) * 1.5; // Drag scroll multiplier
      
      if (Math.abs(x - startX) > 7) {
        hasMoved = true;
      }
      
      filterGroup.scrollLeft = scrollLeft - walk;
    });

    // Intercept and cancel clicks on child pills if we dragged
    filterGroup.addEventListener("click", (e) => {
      if (hasMoved) {
        e.stopPropagation();
        e.preventDefault();
      }
    }, true); // Capture phase to prevent child handlers from executing
  }

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

  // ================= 9.1 LOGIKA POPUP KONTROL MELAYANG (BASEMAP & LEGENDA) =================
  const btnToggleBasemap = document.getElementById("btnToggleBasemap");
  const basemapPopup = document.getElementById("basemapPopup");
  const btnToggleLegend = document.getElementById("btnToggleLegend");
  const legendPopup = document.getElementById("legendPopup");

  function closeAllControlPopups() {
    if (basemapPopup) {
      basemapPopup.classList.remove("show");
      btnToggleBasemap.classList.remove("active");
    }
    if (legendPopup) {
      legendPopup.classList.remove("show");
      btnToggleLegend.classList.remove("active");
    }
  }

  if (btnToggleBasemap && basemapPopup) {
    btnToggleBasemap.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = basemapPopup.classList.contains("show");
      closeAllControlPopups();
      if (!isOpen) {
        basemapPopup.classList.add("show");
        btnToggleBasemap.classList.add("active");
      }
    });
    basemapPopup.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  if (btnToggleLegend && legendPopup) {
    btnToggleLegend.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = legendPopup.classList.contains("show");
      closeAllControlPopups();
      if (!isOpen) {
        legendPopup.classList.add("show");
        btnToggleLegend.classList.add("active");
      }
    });
    legendPopup.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  // Tutup popup jika dokumen diklik di luar
  document.addEventListener("click", () => {
    closeAllControlPopups();
  });

  // ================= 9.3 DETEKSI GESER TARIKAN (DRAG BOTTOM SHEET GESTURE) =================
  let startY = 0;
  let startTranslateY = 0;
  let isDragging = false;
  let sheetHeight = 0;

  if (detailDrawer) {
    detailDrawer.addEventListener("touchstart", (e) => {
      if (window.innerWidth > 768) return;

      const dragHandle = document.getElementById("drawerDragHandle");
      const drawerBody = document.getElementById("drawerBody");
      const touch = e.touches[0];

      const isOnDragHandle = e.target === dragHandle || dragHandle.contains(e.target);
      const isAtTopScroll = drawerBody.scrollTop <= 0;
      const isPeeking = detailDrawer.classList.contains("peeking");

      if (isOnDragHandle || isPeeking || isAtTopScroll) {
        isDragging = true;
        startY = touch.clientY;
        sheetHeight = detailDrawer.offsetHeight;
        const rect = detailDrawer.getBoundingClientRect();
        startTranslateY = rect.top - (window.innerHeight - sheetHeight);
        
        detailDrawer.classList.add("no-transition");
      }
    }, { passive: true });

    detailDrawer.addEventListener("touchmove", (e) => {
      if (!isDragging) return;

      const touch = e.touches[0];
      const deltaY = touch.clientY - startY;
      let newTranslateY = startTranslateY + deltaY;

      const isExpanded = detailDrawer.classList.contains("expanded");
      if (isExpanded && deltaY < 0 && e.target !== document.getElementById("drawerDragHandle")) {
        isDragging = false;
        detailDrawer.classList.remove("no-transition");
        detailDrawer.style.transform = "";
        return;
      }

      if (e.cancelable) e.preventDefault();

      if (newTranslateY < 0) {
        newTranslateY = newTranslateY * 0.3; // Elastisitas tarik lebih dari batas atas
      }

      detailDrawer.style.transform = `translateY(${newTranslateY}px)`;
    }, { passive: false });

    detailDrawer.addEventListener("touchend", (e) => {
      if (!isDragging) return;
      isDragging = false;
      detailDrawer.classList.remove("no-transition");

      const touch = e.changedTouches[0];
      const deltaY = touch.clientY - startY;
      detailDrawer.style.transform = "";

      const peekTranslateY = sheetHeight - 240;
      const currentTranslateVal = startTranslateY + deltaY;

      if (deltaY > 50) {
        // Tarik ke bawah
        if (startTranslateY < 50) {
          // Dari Expanded -> Peek
          detailDrawer.classList.remove("expanded", "closed");
          detailDrawer.classList.add("peeking");
        } else {
          // Dari Peek -> Tutup
          closeDrawer();
        }
      } else if (deltaY < -50) {
        // Tarik ke atas -> Expanded
        detailDrawer.classList.remove("peeking", "closed");
        detailDrawer.classList.add("expanded");
      } else {
        // Geseran kecil, kembalikan ke snap terdekat
        if (currentTranslateVal < peekTranslateY / 2) {
          detailDrawer.classList.remove("peeking", "closed");
          detailDrawer.classList.add("expanded");
        } else if (currentTranslateVal < (sheetHeight - 50)) {
          detailDrawer.classList.remove("expanded", "closed");
          detailDrawer.classList.add("peeking");
        } else {
          closeDrawer();
        }
      }
    });

    // Menghubungkan klik dragHandle pada mobile untuk toggle expanded/peeking
    const dragHandle = document.getElementById("drawerDragHandle");
    if (dragHandle) {
      dragHandle.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          if (detailDrawer.classList.contains("peeking")) {
            detailDrawer.classList.remove("peeking");
            detailDrawer.classList.add("expanded");
          } else if (detailDrawer.classList.contains("expanded")) {
            detailDrawer.classList.remove("expanded");
            detailDrawer.classList.add("peeking");
          }
        }
      });
    }
  }

  // Focus pencarian otomatis menggeser detailDrawer ke bawah agar pencarian leluasa
  if (searchInput) {
    searchInput.addEventListener("focus", () => {
      if (window.innerWidth <= 768 && (detailDrawer.classList.contains("peeking") || detailDrawer.classList.contains("expanded"))) {
        closeDrawer();
      }
    });
  }

  // ================= 9.5 KOORDINAT PICKER (DEVELOPER HELPER) =================
  // Hanya aktif secara lokal (file://, localhost) atau jika URL mengandung '?dev=true' / '?admin=true'
  const isDevMode = urlParams.has("dev") || urlParams.has("admin") || 
                    window.location.hostname === "localhost" || 
                    window.location.hostname === "127.0.0.1" || 
                    window.location.protocol === "file:";

  if (isDevMode) {
    console.log("Developer Mode Aktif: Klik pada peta untuk menyalin format objek lokasi baru.");
    
    map.on("click", (e) => {
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

  // Menutup drawer & control popups ketika mengklik area kosong peta
  map.on("click", (e) => {
    if (e.originalEvent && e.originalEvent.target && e.originalEvent.target.closest('.leaflet-marker-icon')) return;

    closeDrawer();
    closeAllControlPopups();
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
