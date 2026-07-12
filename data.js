// data.js
// Sumber data statis terstruktur untuk Web GIS Portal Kelurahan Andongsili

const KELURAHAN_PROFILE = {
  "name": "Kelurahan Andongsili",
  "district": "Kecamatan Mojotengah",
  "regency": "Kabupaten Wonosobo",
  "province": "Jawa Tengah",
  "postalCode": "56351",
  "address": "Jl. Dieng Km. 4, Mojotengah, Wonosobo, Jawa Tengah",
  "email": "andongsili.mojotengah@gmail.com",
  "phone": "(0286) 321888",
  "description": "Kelurahan Andongsili merupakan salah satu kelurahan strategis di Kecamatan Mojotengah, Kabupaten Wonosobo, Jawa Tengah. Wilayah ini berfungsi sebagai pusat hunian, perdagangan lokal, serta area strategis pendidikan yang berbatasan langsung dengan kompleks akademik Universitas Sains Al-Qur'an (UNSIQ). Dikelilingi pemandangan alam perbukitan dan iklim pegunungan yang sejuk, Andongsili terus berkembang sebagai wilayah penyangga ekonomi perkotaan Wonosobo.",
  "history": "Kelurahan Andongsili memiliki sejarah panjang sebagai kawasan pemukiman agraris yang subur di lereng Gunung Dieng. Seiring waktu, dengan dibangunnya akses Jalan Lingkar Utara Wonosobo dan berdirinya Kampus UNSIQ, wilayah Andongsili bertransformasi menjadi area semi-perkotaan yang dinamis. Meskipun demikian, nilai-nilai gotong royong dan kelestarian alam pedesaan tetap dijunjung tinggi oleh seluruh lapisan masyarakat di kelurahan ini.",
  "heroImage": ""
};

const KELURAHAN_STATS = {
  "population": "3.488",
  "families": "1.240",
  "rwCount": "7",
  "rtCount": "27",
  "areaSize": "2.63"
};

const MAP_CONFIG = {
  "center": [
    -7.3262893,
    109.9233481
  ],
  "zoom": 15
};

const LOCATIONS = [
  {
    "id": 1,
    "name": "Kantor Kelurahan Andongsili",
    "category": "Pemerintahan",
    "latitude": -7.326277,
    "longitude": 109.921981,
    "description": "Kantor Kelurahan Andongsili merupakan pusat pelayanan administrasi dan pemerintahan tingkat kelurahan di Kecamatan Mojotengah. Fasilitas ini menyediakan berbagai layanan kependudukan, perizinan lokal, serta koordinasi pembangunan wilayah bagi masyarakat setempat.",
    "address": "Andongsili, Mojotengah, Rw. 4, Andongsili, Kec. Wonosobo, Kabupaten Wonosobo, Jawa Tengah 56351",
    "image": "assets/photos/kelurahan/KantorKelurahan.webp",
    "contact": "-",
    "hours": "Senin - Kamis: 08.00 - 15.00, Jumat: 08.00 - 11.00, Sabtu - Minggu: Tutup"
  },
  {
    "id": 2,
    "name": "PMI Kabupaten Wonosobo",
    "category": "Kesehatan",
    "latitude": -7.326974,
    "longitude": 109.916962,
    "description": "Markas Palang Merah Indonesia (PMI) Kabupaten Wonosobo yang melayani pelayanan donor darah, bank darah, pertolongan pertama pada kecelakaan (P3K), kesiapsiagaan bencana, serta penyediaan armada ambulans darurat.",
    "address": "Jalan Soepardjo Rustam, Rw. 6, Andongsili, Kec. Mojotengah, Kabupaten Wonosobo, Jawa Tengah 56351",
    "image": "assets/photos/kelurahan/pmi.webp",
    "contact": "0286323354"
  },
  {
    "id": 3,
    "name": "Masjid Al-Istiqomah",
    "category": "Tempat Ibadah",
    "latitude": -7.325999,
    "longitude": 109.922769,
    "description": "Masjid Al-Istiqomah merupakan masjid jami' di Kelurahan Andongsili yang aktif menyelenggarakan shalat berjamaah lima waktu, shalat Jumat, serta pengajian rutin warga. Masjid ini juga menjadi pusat kegiatan keagamaan dan pembinaan mental spiritual umat.",
    "address": "Andongsili Baru, Mojo Tengah, Rw. 4, Andongsili, Kec. Wonosobo, Kabupaten Wonosobo, Jawa Tengah 56351",
    "image": "assets/photos/kelurahan/istiqomah.webp",
    "contact": "-"
  },
  {
    "id": 4,
    "name": "SDN Andongsili",
    "category": "Pendidikan",
    "latitude": -7.324837,
    "longitude": 109.921961,
    "description": "Sekolah Dasar Negeri Andongsili merupakan lembaga pendidikan dasar negeri formal di Kelurahan Andongsili yang berkomitmen mencetak generasi cerdas, berkarakter mulia, serta aktif dalam kegiatan akademis maupun ekstrakurikuler.",
    "address": "MWGC+3PJ, Rw. 7, Andongsili, Kec. Mojotengah, Kabupaten Wonosobo, Jawa Tengah 56351",
    "image": "assets/photos/kelurahan/sdn.webp",
    "contact": "-"
  },
  {
    "id": 5,
    "name": "UNSIQ",
    "category": "Pendidikan",
    "latitude": -7.326638,
    "longitude": 109.912848,
    "description": "Kampus II Universitas Sains Al-Qur'an (UNSIQ) Jawa Tengah di Wonosobo, sebuah perguruan tinggi swasta terkemuka yang memadukan pendidikan sains modern dengan pengkajian dan implementasi nilai-nilai luhur Al-Qur'an.",
    "address": "Rw. 7, Andongsili, Kec. Mojotengah, Kabupaten Wonosobo, Jawa Tengah 56351",
    "image": "assets/photos/kelurahan/unsiq.webp",
    "contact": "-"
  },
  {
    "id": 6,
    "name": "Mushola Nurrus Sulaiman",
    "category": "Tempat Ibadah",
    "latitude": -7.325269,
    "longitude": 109.922223,
    "description": "Mushola lingkungan di Kelurahan Andongsili yang diperuntukkan bagi warga sekitar dalam melaksanakan ibadah shalat berjamaah lima waktu, belajar membaca Al-Qur'an (TPA) bagi anak-anak, serta musyawarah keagamaan warga.",
    "address": "Jl. Soeparjo Roestam, RT.07/RW.02, Rw. 4, Andongsili, Kec. Mojotengah, Kabupaten Wonosobo, Jawa Tengah 56351",
    "image": "assets/photos/kelurahan/musholanurrus.webp",
    "contact": "-"
  },
  {
    "id": 7,
    "name": "Dinas Perhubungan",
    "category": "Pemerintahan",
    "latitude": -7.327379,
    "longitude": 109.915378,
    "description": "Kantor Dinas Perumahan, Kawasan Permukiman, dan Perhubungan Kabupaten Wonosobo yang bertugas dalam pengaturan transportasi darat, tata kelola lalu lintas, serta penyediaan fasilitas keselamatan jalan umum.",
    "address": "Jl. Soeparjo Roestam No.9a, Rw. 6, Andongsili, Kec. Mojotengah, Kabupaten Wonosobo, Jawa Tengah 56351",
    "image": "assets/photos/kelurahan/dishub.webp",
    "contact": "-"
  },
  {
    "id": 8,
    "name": "Amaliyah Salaman Mosque",
    "category": "Tempat Ibadah",
    "latitude": -7.314744,
    "longitude": 109.940185,
    "description": "Masjid jami' yang berlokasi di Dusun Salaman, berfungsi sebagai tempat ibadah shalat lima waktu, shalat Jumat berjamaah, pengajian umum berkala, serta program pembinaan akhlak anak-anak di lingkungan setempat.",
    "address": "Alamat.",
    "image": "https://images.unsplash.com/photo-1541829019-2188201b83a0?auto=format&fit=crop&w=600&q=80",
    "contact": "-"
  },
  {
    "id": 9,
    "name": "Masjid Nurul Huda. Dusun Panggrungan",
    "category": "Tempat Ibadah",
    "latitude": -7.319531,
    "longitude": 109.935105,
    "description": "Masjid Dusun Panggrungan yang merupakan sentra peribadatan dan pusat keagamaan bagi warga setempat di Dusun Panggrungan, Kelurahan Andongsili, dilengkapi dengan program majelis taklim dan pengajaran Al-Qur'an.",
    "address": "Sumberan Barat, West Wonosobo, Wonosobo, Wonosobo Regency, Central Java",
    "image": "assets/photos/kelurahan/nurulhuda.webp",
    "contact": "-",
    "googleMapsUrl": "https://maps.app.goo.gl/zugn1RDEs9qvDweY8"
  },
  {
    "id": 10,
    "name": "Masjid Haji Kosim Kusmana",
    "category": "Tempat Ibadah",
    "latitude": -7.321526,
    "longitude": 109.926436,
    "description": "Masjid yang didirikan atas prakarsa dan wakaf keluarga Haji Kosim Kusmana. Masjid ini memfasilitasi ibadah sehari-hari warga sekitar, pengajian rutin, serta berbagai program pembinaan sosial keagamaan kemasyarakatan.",
    "address": "MWHG+9HM, Rw. 4, Andongsili, Kec. Wonosobo, Kabupaten Wonosobo, Jawa Tengah 56351",
    "image": "assets/photos/kelurahan/hsimkusmana.webp",
    "contact": "-"
  }
];

const KELURAHAN_BOUNDARY = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              109.93989599999999,
              -7.317992000999897
            ],
            [
              109.93980100000003,
              -7.3180550009999585
            ],
            [
              109.93979500000007,
              -7.318065999999892
            ],
            [
              109.93972500000005,
              -7.318115999999943
            ],
            [
              109.93937800000003,
              -7.318301999999967
            ],
            [
              109.93852400000007,
              -7.319182999999942
            ],
            [
              109.93792399900008,
              -7.31972900099991
            ],
            [
              109.93726700000008,
              -7.320315999999895
            ],
            [
              109.93719300000008,
              -7.320359999999894
            ],
            [
              109.93694600000006,
              -7.320530999999921
            ],
            [
              109.93673900000009,
              -7.320704000999935
            ],
            [
              109.93648200000004,
              -7.320931999999971
            ],
            [
              109.93633100000008,
              -7.3210569999999215
            ],
            [
              109.93621500000008,
              -7.321152000999966
            ],
            [
              109.93603000000004,
              -7.321346999999935
            ],
            [
              109.93561800100005,
              -7.321854999999957
            ],
            [
              109.93528000000006,
              -7.322054999999985
            ],
            [
              109.93478200000007,
              -7.32215499999991
            ],
            [
              109.93446600100005,
              -7.322297999999929
            ],
            [
              109.93413200000003,
              -7.322479999999889
            ],
            [
              109.93372300000003,
              -7.322531999999928
            ],
            [
              109.93365699900008,
              -7.32252999999994
            ],
            [
              109.93312499900011,
              -7.322545999999932
            ],
            [
              109.93275300100007,
              -7.322638999999988
            ],
            [
              109.93219800000006,
              -7.322916998999986
            ],
            [
              109.931857,
              -7.323107000999897
            ],
            [
              109.93152700000005,
              -7.323317000999953
            ],
            [
              109.93115900000006,
              -7.323636999999962
            ],
            [
              109.93095300000007,
              -7.323802999999931
            ],
            [
              109.930775,
              -7.324083000000005
            ],
            [
              109.93059400000004,
              -7.324382999999958
            ],
            [
              109.93040600000002,
              -7.324600999999966
            ],
            [
              109.93025999900003,
              -7.3246819999999175
            ],
            [
              109.92955800000003,
              -7.32494299999993
            ],
            [
              109.92952099900008,
              -7.32495099999997
            ],
            [
              109.92917400000005,
              -7.325061998999917
            ],
            [
              109.92887400000009,
              -7.325147999999928
            ],
            [
              109.92820900000005,
              -7.3253379999999275
            ],
            [
              109.92817900000006,
              -7.325351998999931
            ],
            [
              109.92806900000002,
              -7.325422999999944
            ],
            [
              109.92777600000002,
              -7.325590999999989
            ],
            [
              109.9274110000001,
              -7.325791000000017
            ],
            [
              109.92636399900007,
              -7.326207999999969
            ],
            [
              109.9262880000001,
              -7.326229999999924
            ],
            [
              109.92553900000011,
              -7.326564999999931
            ],
            [
              109.92496400000006,
              -7.326830000000008
            ],
            [
              109.92467000000006,
              -7.326950999999983
            ],
            [
              109.92461000000007,
              -7.3269929999999945
            ],
            [
              109.92447700000008,
              -7.32708799999995
            ],
            [
              109.92418800000007,
              -7.327314999999903
            ],
            [
              109.92398500000006,
              -7.327419999999975
            ],
            [
              109.92372200000005,
              -7.327439999999942
            ],
            [
              109.9236430000001,
              -7.32743399999989
            ],
            [
              109.91999700000005,
              -7.328546000999971
            ],
            [
              109.91852600000001,
              -7.328735999999971
            ],
            [
              109.91364800000008,
              -7.329772999999975
            ],
            [
              109.91173599900007,
              -7.331023999999921
            ],
            [
              109.91181200000005,
              -7.33091199999998
            ],
            [
              109.91182500000006,
              -7.330868999999975
            ],
            [
              109.91183100000002,
              -7.330813999999954
            ],
            [
              109.91181400000004,
              -7.3306750009999995
            ],
            [
              109.911775999,
              -7.3304189999999565
            ],
            [
              109.91177400000002,
              -7.330302000999957
            ],
            [
              109.91183000000004,
              -7.329571999999953
            ],
            [
              109.9118480010001,
              -7.329344999999911
            ],
            [
              109.91188300100006,
              -7.329063999999931
            ],
            [
              109.91206600000002,
              -7.327872999999975
            ],
            [
              109.91218000100012,
              -7.327586000999943
            ],
            [
              109.91219000000007,
              -7.327569999999952
            ],
            [
              109.91229600000004,
              -7.327412000000024
            ],
            [
              109.91233200000009,
              -7.327372999999994
            ],
            [
              109.91233900000005,
              -7.32735599999992
            ],
            [
              109.91233899900004,
              -7.327214999999978
            ],
            [
              109.91224500000008,
              -7.32691099999996
            ],
            [
              109.91224900000006,
              -7.325956999999985
            ],
            [
              109.91227799900007,
              -7.325574000000003
            ],
            [
              109.91230400000008,
              -7.325299999999981
            ],
            [
              109.91234800000008,
              -7.324708999999931
            ],
            [
              109.91244600000002,
              -7.324177000999967
            ],
            [
              109.91246300000009,
              -7.324111999999918
            ],
            [
              109.91247100000004,
              -7.324108999999936
            ],
            [
              109.9126379990001,
              -7.324098999999908
            ],
            [
              109.91282000000005,
              -7.3242029999999865
            ],
            [
              109.91297900000006,
              -7.324283999999938
            ],
            [
              109.9131769990001,
              -7.32427399999991
            ],
            [
              109.91381400000006,
              -7.323996000000001
            ],
            [
              109.91414400000009,
              -7.323995000000007
            ],
            [
              109.9145520000001,
              -7.323864000999915
            ],
            [
              109.91478000000005,
              -7.323875999999931
            ],
            [
              109.9150339990001,
              -7.3239369999999155
            ],
            [
              109.91522699900008,
              -7.323928999999964
            ],
            [
              109.915489,
              -7.323842999999954
            ],
            [
              109.91593900000002,
              -7.323513001000006
            ],
            [
              109.9161450000001,
              -7.32337099999998
            ],
            [
              109.91630600000009,
              -7.323332999999945
            ],
            [
              109.91672300000005,
              -7.3232579999999565
            ],
            [
              109.91724300000008,
              -7.323273999999948
            ],
            [
              109.91745700000003,
              -7.323100999999934
            ],
            [
              109.917534,
              -7.323036999999967
            ],
            [
              109.9178400000001,
              -7.3228359999999455
            ],
            [
              109.91848300000001,
              -7.3226799989999165
            ],
            [
              109.91884200000005,
              -7.322638999999988
            ],
            [
              109.91916500000004,
              -7.32262899999996
            ],
            [
              109.91958400000007,
              -7.322617999999938
            ],
            [
              109.91984700000008,
              -7.322586999999949
            ],
            [
              109.92018900000004,
              -7.322473999999925
            ],
            [
              109.92035800000008,
              -7.322372000000012
            ],
            [
              109.92055600000002,
              -7.322142999999894
            ],
            [
              109.92079100000011,
              -7.321866999999973
            ],
            [
              109.9209680000001,
              -7.321693999999958
            ],
            [
              109.92113000000009,
              -7.32161899999997
            ],
            [
              109.92169000000005,
              -7.321600999999902
            ],
            [
              109.92205900000003,
              -7.321590999999962
            ],
            [
              109.92286700100001,
              -7.321412999999978
            ],
            [
              109.92343100000005,
              -7.321372000999961
            ],
            [
              109.92551100000011,
              -7.319565999999924
            ],
            [
              109.92638600000004,
              -7.317925999999943
            ],
            [
              109.92573399900009,
              -7.31760999999991
            ],
            [
              109.92607700000005,
              -7.317533999999927
            ],
            [
              109.92610300000007,
              -7.317525000999982
            ],
            [
              109.92678600000009,
              -7.317239999999938
            ],
            [
              109.92732700000009,
              -7.31707400099997
            ],
            [
              109.92737399900007,
              -7.3170649989999355
            ],
            [
              109.92753500000006,
              -7.317027999999894
            ],
            [
              109.92823900000005,
              -7.316761999999912
            ],
            [
              109.92860600000004,
              -7.316444999999973
            ],
            [
              109.92897700000009,
              -7.316258000999955
            ],
            [
              109.92937600000006,
              -7.316160999999923
            ],
            [
              109.92977400000005,
              -7.316138999999968
            ],
            [
              109.9300130000001,
              -7.316125999999958
            ],
            [
              109.93033200000012,
              -7.315973998999905
            ],
            [
              109.93061900000006,
              -7.315862999999958
            ],
            [
              109.93121700000007,
              -7.315865999999939
            ],
            [
              109.9317970000001,
              -7.315949000999968
            ],
            [
              109.93210100000003,
              -7.315983000999939
            ],
            [
              109.93226899900007,
              -7.315964000999966
            ],
            [
              109.93244600000006,
              -7.3158859999999954
            ],
            [
              109.93274100000005,
              -7.3157749999999595
            ],
            [
              109.93291699900004,
              -7.315702999999953
            ],
            [
              109.93299400000011,
              -7.315635999999916
            ],
            [
              109.93298800000005,
              -7.315580000999901
            ],
            [
              109.93303300000005,
              -7.315449999999981
            ],
            [
              109.93314400000008,
              -7.314975000999937
            ],
            [
              109.93317400000008,
              -7.314843999999933
            ],
            [
              109.93377400000007,
              -7.314141999999936
            ],
            [
              109.9343240000001,
              -7.313859999999963
            ],
            [
              109.93481200000006,
              -7.313712999999968
            ],
            [
              109.93523699900007,
              -7.31363799999998
            ],
            [
              109.93549000000003,
              -7.313613999999948
            ],
            [
              109.93569500000004,
              -7.3135939989999805
            ],
            [
              109.93590100000003,
              -7.313541999999941
            ],
            [
              109.9359180000001,
              -7.31353399899999
            ],
            [
              109.93602900100005,
              -7.313470000999935
            ],
            [
              109.93612700000007,
              -7.313103000999945
            ],
            [
              109.93624800000005,
              -7.3128629999998935
            ],
            [
              109.93674400000005,
              -7.312203000999908
            ],
            [
              109.93694700100006,
              -7.312009999999926
            ],
            [
              109.936985,
              -7.311979999999931
            ],
            [
              109.93752500000001,
              -7.311690999999911
            ],
            [
              109.93779300000007,
              -7.3115839999999395
            ],
            [
              109.93822800000001,
              -7.311530999999906
            ],
            [
              109.93831400000002,
              -7.311519000999979
            ],
            [
              109.9383149640001,
              -7.311519137999902
            ],
            [
              109.93832100000006,
              -7.311519999999973
            ],
            [
              109.93856000000002,
              -7.311580000999964
            ],
            [
              109.93890299900008,
              -7.311563999999972
            ],
            [
              109.93929199900002,
              -7.311573999999911
            ],
            [
              109.93953700000013,
              -7.311601000999925
            ],
            [
              109.9396590000001,
              -7.3115729999999175
            ],
            [
              109.93980700000009,
              -7.311410999999925
            ],
            [
              109.93996900000008,
              -7.3110719999999425
            ],
            [
              109.94085199900005,
              -7.310881000999949
            ],
            [
              109.94103808100007,
              -7.3111816489999555
            ],
            [
              109.9411069990001,
              -7.3112930000000205
            ],
            [
              109.94134500000007,
              -7.311622999999969
            ],
            [
              109.94153900000005,
              -7.311954999999994
            ],
            [
              109.94168900000003,
              -7.312210999999948
            ],
            [
              109.94188300000009,
              -7.3124509999999106
            ],
            [
              109.94214700000008,
              -7.3125959999999175
            ],
            [
              109.94236100000002,
              -7.3127619999999744
            ],
            [
              109.9425390010001,
              -7.313027999999957
            ],
            [
              109.9426560000001,
              -7.313357000999911
            ],
            [
              109.94285600100004,
              -7.313938000999933
            ],
            [
              109.94288100000006,
              -7.313924998999923
            ],
            [
              109.94286800000005,
              -7.314167999999956
            ],
            [
              109.94274600000008,
              -7.314396999999897
            ],
            [
              109.94260700000004,
              -7.314627000000009
            ],
            [
              109.94241800000012,
              -7.314855999999949
            ],
            [
              109.94226700100006,
              -7.31518700099998
            ],
            [
              109.94213800000004,
              -7.315466999999966
            ],
            [
              109.942012,
              -7.315753999999998
            ],
            [
              109.94179700000008,
              -7.316119999999994
            ],
            [
              109.94180300000004,
              -7.316127000999952
            ],
            [
              109.94162400000006,
              -7.316310999999899
            ],
            [
              109.94143499900005,
              -7.316499
            ],
            [
              109.94101200000004,
              -7.316806999999905
            ],
            [
              109.94065900000007,
              -7.317019999999943
            ],
            [
              109.94031300000003,
              -7.317271000999927
            ],
            [
              109.94002700000009,
              -7.317721999999939
            ],
            [
              109.93999200000012,
              -7.3177769999999605
            ],
            [
              109.93989599999999,
              -7.317992000999897
            ]
          ]
        ]
      },
      "properties": {
        "KDPPUM": "",
        "NAMOBJ": "Adongsili",
        "REMARK": "Wilayah Administrasi Keluruhan/Desa",
        "KDPBPS": "",
        "FCODE": "",
        "LUASWH": 0,
        "UUPP": "",
        "SRS_ID": "",
        "LCODE": "BA0020",
        "METADATA": "",
        "KDEBPS": "",
        "KDEPUM": "",
        "KDCBPS": "",
        "KDCPUM": "",
        "KDBBPS": "",
        "KDBPUM": "",
        "WADMKD": "",
        "WIADKD": "",
        "WADMKC": "Mojotengah",
        "WIADKC": "",
        "WADMKK": "Kabupaten Wonosobo",
        "WIADKK": "",
        "WADMPR": "Jawa Tengah",
        "WIADPR": "",
        "TIPADM": 0,
        "SHAPE_Leng": 0.0830327013599,
        "SHAPE_Area": 0.00021143224034
      }
    }
  ]
};
