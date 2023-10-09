const domain = "https://bloodbankapi.ardhaapps.com/ntf/"
let oldMobile = "";

function loadMasterList(){
    $.ajax({
        url: domain+"master/master-list",
        type: 'GET',
        success: function(res) {
            if(res.status =="success"){
                let bloodOption ='<option value="">Select Blood Group</option>';
                $.each(res['bloodGroups'], function(key,value) {
                    bloodOption +='<option value="'+value['id']+'">'+value['title']+'</option>';
                })
                $('.blood_group').html(bloodOption)
                let statesOption ='<option value="">Select States</option>';
                $.each(res['states'], function(key,value) {
                    statesOption +='<option value="'+value['id']+'">'+value['name']+'</option>';
                })
                $('.state_id').html(statesOption)
            }
        }
    });
}
$( document ).ready(function(){
    $('#register-form').on('submit',function(e){
        e.preventDefault();
        let formValue = $('#register-form').serialize();
        $.ajax({
            url: domain+"donor/register",
            type: 'POST',
            data:formValue,
            success: function(res) {
                if(res.status =="success"){
                    Swal.fire({
                        title: 'Success!',
                        text: 'Thanks for registered with us!!',
                        icon: 'success',
                        confirmButtonText: 'Done'
                    })
                    $("#register-form")[0].reset()
                }
                if(res.status == "error"){
                    Swal.fire({
                        title: 'Error!',
                        text: res.message,
                        icon: 'error',
                        confirmButtonText: 'Okay'
                    })
                }
            }
        });
    });

    $('#register-form #mobile').on('keyup',function(e){
        e.preventDefault();
        let value = $(this).val();
        let input = $(this);
        let errorValidation = $(this).parent();
        if(value.length == 10 && oldMobile != value){
            oldMobile = value;
            $.ajax({
                url: domain+"donor/validate-data",
                type: 'GET',
                data:{mobile:value},
                success: function(res) {
                    if(res.status =="success"){
                        input.addClass('form-success').removeClass("form-error");
                        errorValidation.find(".form-validation-error").css("display","none").html("")
                    }
                    if(res.status == "error"){
                        errorValidation.find(".form-validation-error").css("display","block").html(res.error)
                        input.addClass("form-error").removeClass("form-success");
                    }
                }
            });
        } else {

        }
    });

    $('#register-form #email').on('keyup',function(e){
        e.preventDefault();
        let value = $(this).val();
        let input = $(this);
        let errorValidation = $(this).parent();
        var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i
        if(pattern.test(value)){
            $.ajax({
                url: domain+"donor/validate-data",
                type: 'GET',
                data:{email:value},
                success: function(res) {
                    if(res.status =="success"){
                        input.addClass('form-success').removeClass("form-error");
                        errorValidation.find(".form-validation-error").css("display","none").html("")
                    }
                    if(res.status == "error"){
                        input.addClass("form-error").removeClass("form-success");
                        errorValidation.find(".form-validation-error").css("display","block").html(res.error)
                    }
                }
            });
        }
    });

    

    $('.state_id').on('change',function(e){
        e.preventDefault();
        let state_id = $('.state_id :selected').val();
        loadDistrict(state_id);
    });

    $('.district_id').on('change',function(e){
        e.preventDefault();
        let district_id = $('.district_id :selected').val();
        loadCity(district_id);
    });

    function loadDistrict(state_id){
        $('.city_id').html('<option value="">Select City</option>');
        $.ajax({
            type : "get",
            url: domain+"master/master-data",
            data:{state_id:state_id},
            beforeSend: function(msg){
                 $('.district_id').html('<option value="">Loading...</option>');
            },
            success:function(data){
                data = data;
                if (data['status'] == 'success'){
                    if(data['data'] !=''){
                        let option ='<option value="">Select District</option>';
                        $.each(data['data'], function(key,value) {
                            option +='<option value="'+value['id']+'">'+value['name']+'</option>';
                        })
                        $('.district_id').html(option);
                    }else{
                        $('.district_id').html('');
                    }
                }else{
                    $('.district_id').html('');
                }
            }
        });
    }

    function loadCity(district_id){
        $.ajax({
            type : "get",
            url: domain+"master/master-data",
            data:{district_id:district_id},
            beforeSend: function(msg){
                 $('.city_id').html('<option value="">Loading...</option>');
            },
            success:function(data){
                data = data;
                if (data['status'] == 'success'){
                    if(data['data'] !=''){
                        let option ='<option value="">Select City</option>';
                        $.each(data['data'], function(key,value) {
                            option +='<option value="'+value['id']+'">'+value['name']+'</option>'
                        })
                        $('.city_id').html(option);
                    }else{
                        $('.city_id').html('');
                    }
                }else{
                    $('.city_id').html('');
                }
            }
        });
    }
})