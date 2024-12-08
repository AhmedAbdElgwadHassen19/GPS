// متغيرات
var map = L.map('map').setView([30.0444, 31.2357], 12);  // إحداثيات افتراضية (القاهرة)
var userActive = false; // حالة المستخدم
var routeControl; // المتحكم في المسار

// تحميل الخريطة باستخدام OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// تفعيل/إلغاء تفعيل المستخدم
$('#userBtn').click(function() {
    userActive = !userActive;
    console.log(userActive); // طباعة حالة المستخدم في الكونسول
    $(this).text(userActive ? 'إلغاء تفعيل المستخدم' : 'تفعيل المستخدم');
});

// إظهار مدخلات الرحلة عند الضغط على زر "طلب رحلة"
$('#tripBtn').click(function() {
    $('#tripInputs').toggle();
});

// بدء الرحلة
$('#startTripBtn').click(function() {
    var startLocation = $('#startLocation').val();
    var endLocation = $('#endLocation').val();
    
    if (startLocation && endLocation) {
        // من المفترض هنا استخدام API لتحويل أسماء المدن إلى إحداثيات
        getCoordinatesFromLocation(startLocation, function(startCoords) {
            getCoordinatesFromLocation(endLocation, function(endCoords) {
                // طباعة الإحداثيات في الكونسول
                console.log('إحداثيات نقطة البداية: ', startCoords);
                console.log('إحداثيات نقطة النهاية: ', endCoords);

                // عرض المسار بين النقاط
                if (routeControl) {
                    map.removeControl(routeControl);  // إزالة المسار السابق إذا كان موجود
                }

                // رسم المسار بين النقاط بلون أزرق
                routeControl = L.Routing.control({
                    waypoints: [
                        L.latLng(startCoords),
                        L.latLng(endCoords)
                    ],
                    routeWhileDragging: true,
                    lineOptions: {
                        styles: [{ color: 'blue', weight: 5 }]  // تغيير اللون إلى الأزرق
                    }
                }).addTo(map);

                // إفراغ المدخلات بعد بدء الرحلة
                $('#startLocation').val('');
                $('#endLocation').val('');
                $('#tripInputs').hide(); // إخفاء مدخلات الرحلة بعد بدء الرحلة
            });
        });
    } else {
        alert('من فضلك أدخل كلا النقطتين');
    }
});

// إلغاء الرحلة
$('#cancelTripBtn').click(function() {
    if (routeControl) {
        map.removeControl(routeControl);  // إزالة المسار
    }
    $('#startLocation').val('');
    $('#endLocation').val('');
    $('#tripInputs').hide(); // إخفاء مدخلات الرحلة
});

// دالة لتحويل أسماء المدن إلى إحداثيات باستخدام API من OpenStreetMap (Nominatim)
function getCoordinatesFromLocation(location, callback) {
    var geocodeUrl = 'https://nominatim.openstreetmap.org/search?format=json&q=' + location;
    
    $.ajax({
        url: geocodeUrl,
        success: function(data) {
            if (data && data.length > 0) {
                var coords = [data[0].lat, data[0].lon];
                callback(coords);
            } else {
                alert('لم يتم العثور على إحداثيات لهذا الموقع');
            }
        }
    });
}