$(document).ready(function() {
  // إنشاء الخريطة باستخدام Leaflet
  const map = L.map('map').setView([30.033, 31.233], 5); // نقطة البداية الافتراضية في مصر

  // إضافة الخريطة من OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // دالة لتحويل اسم المدينة إلى إحداثيات باستخدام Nominatim API
  function getCoordinates(city, callback) {
    $.ajax({
      url: `https://nominatim.openstreetmap.org/search?format=json&q=${city}`,
      method: 'GET',
      success: function(data) {
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          callback(lat, lon);
        } else {
          alert('المدينة أو المنطقة غير موجودة');
        }
      },
      error: function() {
        alert('حدث خطأ أثناء البحث عن المدينة');
      }
    });
  }

  // وظيفة لعرض المسار بين نقطتين على الخريطة
  function plotRoute(startLat, startLng, endLat, endLng) {
    // تنظيف الخريطة من أي مسارات سابقة
    map.eachLayer(function(layer) {
      if (layer instanceof L.Polyline || layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // إضافة نقطة البداية
    const startMarker = L.marker([startLat, startLng]).addTo(map).bindPopup("نقطة البداية").openPopup();

    // تكبير الخريطة على نقطة البداية
    map.setView([startLat, startLng], 10); // الرقم 10 يمثل مستوى التكبير (يمكنك تغييره حسب الحاجة)

    // إضافة نقطة النهاية
    const endMarker = L.marker([endLat, endLng]).addTo(map).bindPopup("نقطة النهاية").openPopup();

    // رسم المسار بين النقاط
    const route = L.polyline([
      [startLat, startLng],
      [endLat, endLng]
    ], { color: 'blue' }).addTo(map);
  }

  // عند الضغط على زر "عرض المسار"
  $('#plotRoute').click(function() {
    const startCity = $('#startCity').val().trim();
    const endCity = $('#endCity').val().trim();

    if (startCity && endCity) {
      // البحث عن الإحداثيات للمدينة الأولى
      getCoordinates(startCity, function(startLat, startLng) {
        // البحث عن الإحداثيات للمدينة الثانية
        getCoordinates(endCity, function(endLat, endLng) {
          // رسم المسار بين المدينتين
          plotRoute(startLat, startLng, endLat, endLng);
        });
      });
    } else {
      alert('الرجاء إدخال اسم المدينة أو المنطقة في كلا الحقلين');
    }
  });

  // عند الضغط على زر "طلب رحلة"
  $('#requestTrip').click(function() {
    // إظهار input لإدخال المدن
    $('.input-group').toggle();
    map.eachLayer(function(layer) {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer); // مسح العلامات السابقة
      }
    });
    // إعادة الخريطة إلى الحالة الافتراضية
    map.setView([30.033, 31.233], 5); // إعادة الخريطة إلى نقطة البداية
  });

  // عند الضغط على زر "إلغاء الرحلة"
  $('#cancelTrip').click(function() {
    // إخفاء input
    $('.input-group').hide();
    // مسح الخريطة
    map.eachLayer(function(layer) {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer); // مسح العلامات والمسارات
      }
    });
    // إعادة الخريطة إلى الحالة الافتراضية
    map.setView([30.033, 31.233], 5);
  });

  // عند الضغط على زر "تفعيل/تعطيل المستخدم"
  $('#toggleUserStatus').click(function() {
    const currentText = $(this).text();
    if (currentText === 'تفعيل/تعطيل المستخدم') {
      // تغيير النص إلى "المستخدم مفعل"
      $(this).text('المستخدم مفعل');
      alert('تم تفعيل المستخدم');
    } else {
      // تغيير النص إلى "تفعيل/تعطيل المستخدم"
      $(this).text('تفعيل/تعطيل المستخدم');
      alert('تم تعطيل المستخدم');
    }
  });
});

