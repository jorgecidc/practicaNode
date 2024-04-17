if (!window.jQuery) { console.error("Debes cargar jQuery antes de usar pix-formularios"); }

$.urlParam = function (name) {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(name)
};

var dType = { 'A': 'Sociedad Anónima', 'B': 'Sociedad de Responsabilidad Limitada', 'C': 'Sociedad Colectiva', 'D': 'Sociedad Comanditaria', 'E': 'Comunidad de Bienes', 'F': 'Sociedad Cooperativa', 'G': 'Asociación o Fundación', 'H': 'Comunidad de Propietarios en Régimen de Propiedad Horizontal', 'J': 'Sociedad Civil, con o sin Personalidad Jurídica', 'K': 'Español menor de 14 años', 'L': 'Español residente en el extranjero sin DNI', 'M': 'NIF que otorga la Agencia Tributaria a extranjeros que no tienen NIE', 'N': 'Entidad Extranjera', 'P': 'Corporación Local', 'Q': 'Organismo Autónomo, Estatal o no, o Asimilado, o Congregación o Institución Religiosa', 'R': 'Congregación o Institución Religiosa (desde 2008, ORDEN EHA/451/2008)', 'S': 'Órgano de la Administración General del Estado o de las Comunidades Autónomas', 'U': 'Unión Temporal de Empresas', 'V': 'Sociedad Agraria de Transformación', 'W': 'Establecimiento permanente de entidad no residente en España', 'X': 'Extranjero identificado por la Policía con un número de identidad de extranjero, NIE, asignado hasta el 15 de julio de 2008', 'Y': 'Extranjero identificado por la Policía con un NIE, asignado desde el 16 de julio de 2008 (Orden INT/2058/2008, BOE del 15 de julio)', 'Z': 'Letra reservada para cuando se agoten los "Y" para Extranjeros identificados por la Policía con un NIE' };
var dProv = { '00': 'No Residente', '01': 'Álava', '02': 'Albacete', '03': 'Alicante', '53': 'Alicante', '54': 'Alicante', '04': 'Almería', '05': 'Ávila', '06': 'Badajoz', '07': 'Islas Baleares', '57': 'Islas Baleares', '08': 'Barcelona', '58': 'Barcelona', '59': 'Barcelona', '60': 'Barcelona', '61': 'Barcelona', '62': 'Barcelona', '63': 'Barcelona', '64': 'Barcelona', '65': 'Barcelona', '66': 'Barcelona', '68': 'Barcelona', '09': 'Burgos', '10': 'Cáceres', '11': 'Cádiz', '72': 'Cádiz', '12': 'Castellón', '13': 'Ciudad Real', '14': 'Córdoba', '56': 'Córdoba', '15': 'La Coruña', '70': 'La Coruña', '16': 'Cuenca', '17': 'Gerona', '55': 'Gerona', '67': 'Gerona', '18': 'Granada', '19': 'Guadalajara', '20': 'Guipúzcoa', '71': 'Guipúzcoa', '21': 'Huelva', '22': 'Huesca', '23': 'Jaén', '24': 'León', '25': 'Lérida', '26': 'La Rioja', '27': 'Lugo', '28': 'Madrid', '78': 'Madrid', '79': 'Madrid', '80': 'Madrid', '81': 'Madrid', '82': 'Madrid', '83': 'Madrid', '84': 'Madrid', '85': 'Madrid', '86': 'Madrid', '87': 'Madrid', '29': 'Málaga', '92': 'Málaga', '93': 'Málaga', '30': 'Murcia', '73': 'Murcia', '31': 'Navarra', '71': 'Navarra', '32': 'Orense', '33': 'Asturias', '74': 'Asturias', '34': 'Palencia', '35': 'Las Palmas', '76': 'Las Palmas', '36': 'Pontevedra', '27': 'Pontevedra', '94': 'Pontevedra', '37': 'Salamanca', '38': 'Santa Cruz de Tenerife', '75': 'Santa Cruz de Tenerife', '39': 'Cantabria', '40': 'Segovia', '41': 'Sevilla', '90': 'Sevilla', '91': 'Sevilla', '42': 'Soria', '43': 'Tarragona', '77': 'Tarragona', '44': 'Teruel', '45': 'Toledo', '46': 'Valencia', '96': 'Valencia', '97': 'Valencia', '98': 'Valencia', '47': 'Valladolid', '48': 'Vizcaya', '95': 'Vizcaya', '49': 'Zamora', '50': 'Zaragoza', '99': 'Zaragoza', '51': 'Ceuta', '52': 'Melilla' };

function checkNIFv2(nif) {
    nif = nif.toUpperCase().replace(/[_\W\s]+/g, '');
    if (/^(\d|[XYZ])\d{7}[A-Z]$/.test(nif)) {
        var num = nif.match(/\d+/);
        num = (nif[0] != 'Z' ? nif[0] != 'Y' ? 0 : 1 : 2) + num;
        if (nif[8] == 'TRWAGMYFPDXBNJZSQVHLCKE'[num % 23]) {
            return /^\d/.test(nif) ? 'DNI' : 'NIE: ' + dType[nif[0]];
        }
    }
    else if (/^[ABCDEFGHJKLMNPQRSUVW]\d{7}[\dA-J]$/.test(nif)) {
        for (var sum = 0, i = 1; i < 8; ++i) {
            var num = nif[i] << i % 2;
            sum += int(num / 10) + num % 10
        }
        var c = (10 - sum) % 10;
        if (((/[KLMNPQRSW]/.test(nif[0]) || (nif[1] + nif[2]) == '00') && nif[8] == 'JABCDEFGHI'[c]) ||
            (/[ABEH]/.test(nif[0]) && nif[8] == c) ||
            (/[CDFGJUV]/.test(nif[0]) && (nif[8] == 'JABCDEFGHI'[c] || nif[8] == c))) {
            return (/^[KLM]/.test(nif) ? 'ESP: ' :
                'CIF: (' + dProv[nif.substr(1, 2)] + ') ') + dType[nif[0]];
        }
    }
    return false;
}

function cargarCampos() {


    $(".pix-campo input, .pix-campo textarea, .pix-campo select").not('.pix-campo input[type=checkbox]').not('.pix-campo input[type=radio]').not('.pix-campo input[type=hidden]').not(':disabled').not('[readonly]').focus(function () { $(this).closest('.pix-campo').addClass("pix-foco"); });
    $(".pix-campo input[type=color]").unbind("focus");
    $(".pix-campo input, .pix-campo textarea, .pix-campo select").focusout(function () { $(this).closest('.pix-campo').removeClass("pix-foco"); });
    $('.pix-campo select, .pix-campo input[type=date],.pix-campo select, .pix-campo input[type=datetime-local], .pix-campo input[type=time], .pix-campo input[type=color]').each(function () { $(this).closest('.pix-campo').addClass("pix-label-fija"); });

    $('.pix-campo input[type=color]').each(function () {
        if ($(this).attr("title") == undefined) {
            $(this).attr("title", "Cambiar color");
        }
    });
    $('.pix-campo input[type=date]').each(function () {
        if ($(this).attr("placeholder") == undefined) {
            $(this).attr("placeholder", "dd/mm/aaaa");
        }
    });
    $('.pix-campo input[type=datetime-local]').each(function () {
        if ($(this).attr("placeholder") == undefined) {
            $(this).attr("placeholder", "dd/mm/aaaa hh:mm");
        }
    });
    $('.pix-campo input[type=time]').each(function () {
        if ($(this).attr("placeholder") == undefined) {
            $(this).attr("placeholder", "hh:mm");
        }
    });

    $(".pix-slider input").each(function () {
        var formatoLabel = $(this).attr('data-formato-label');
        if (formatoLabel != undefined) {
            formatoLabel = formatoLabel.replace('[VALOR]', $(this).val());
            $(this).closest('.pix-slider').find('label').html(formatoLabel);
        }
    });

    $('.pix-radio, .pix-check').each(function () {

        if ($(this).parent().hasClass("pix-campo")) {
            $(this).parent().addClass("pix-label-fija");
        }
        if ($(this).find("label").find("span.pix-marcado").length == 0) {
            $(this).find("label").append($("<span>", { "class": "pix-marcado" }));
        }
    });


    $(".pix-slider input").on('input change', function (e) {
        var formatoLabel = $(this).attr('data-formato-label');
        if (formatoLabel != undefined) {
            formatoLabel = formatoLabel.replace('[VALOR]', $(this).val());
            $(this).closest('.pix-slider').find('label').html(formatoLabel);
        }
    });

    $(".pix-campo input, .pix-campo textarea").on('keyup change input keydown', function (e) {
        if (e.keyCode != 9 && e.keyCode != 16 && e.keyCode != 17 && e.keyCode != 18) {


            var pixCampo = $(this).closest('.pix-campo');
            $(".pix-tooltip").remove();
            if ($(this)[0].validity && ($(this)[0].validity.badInput || !$(this)[0].validity.valid)) {
                //Html5 devuelve que es inválido
                pixCampo.addClass("pix-no-valido");
                if (pixCampo.find(".pix-span-error").length == 0) {
                    if ($(this).attr("data-error") != undefined) {
                        pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html($(this).attr("data-error")));

                    } else {
                        if ($(this).attr('type') != undefined && ($(this).attr('type').toLowerCase() == 'email')) {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html('Por favor, introduce un email válido'));
                        }
                        else {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html('Por favor, completa este campo'));
                        }
                    }
                }
            } else {
                pixCampo.find(".pix-span-error").remove();
                pixCampo.removeClass("pix-no-valido");
            }

            if ($(this).val() != '') {
                pixCampo.addClass("pix-relleno");
            } else {
                pixCampo.removeClass("pix-relleno");
            }

            if (!isNaN($(this).attr("maxlength")) && $(this).attr("maxlength") < 10000) {
                var pixContadorCaracteres = pixCampo.find(".pix-contador-caracteres");
                var caracteres = $(this).val().length;
                if (caracteres > $(this).attr("maxlength")) {
                    caracteres = $(this).attr("maxlength");
                }

                pixContadorCaracteres.html(caracteres + '/' + $(this).attr("maxlength"));

                if (e.type == 'keydown') {

                    if (caracteres == $(this).attr("maxlength")) {
                        if (e.keyCode != 13 && e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40 && e.keyCode != 8 && e.keyCode != 17 && e.keyCode != 18) {
                            pixCampo.addClass("limite");
                            setTimeout(function () { pixCampo.removeClass("limite") }, 2000);
                        }
                    }
                    if ($(this).val().length > $(this).attr("maxlength")) { $(this).val($(this).val().substring(0, $(this).attr("maxlength"))); }
                }

            }
        }
    });

    $(".pix-campo input[type=number]").on("input", function (e) {
        if ($(this).attr("max") != undefined) {

            if (Number($(this).attr("max")) < Number($(this).val())) {
                $(this).val(Number($(this).attr("max")));
                e.preventDefault();
            }
        }
    });

    $(".pix-campo input[data-validar-nif],.pix-campo input[data-validar-nie],.pix-campo input[data-validar-nif-nie],.pix-campo input[data-validar-nif-nie-cif]" +
        ",.pix-campo input[data-validar-email-estricto],.pix-campo input[type=email]").blur(function (e) {
            var pixCampo = $(this).parent();
            if ($(this).attr("data-validar-nif") != undefined) {

                if (!validarNIF($(this))) {
                    //El NIF no es válido
                    pixCampo.addClass("pix-no-valido");
                    if ($(this).parent().find(".pix-span-error").length == 0) {
                        if ($(this).attr("data-error") != undefined) {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html($(this).attr("data-error")));
                        } else {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html('Por favor, completa este campo'));
                        }
                    }
                }
            }

            if ($(this).attr("data-validar-nie") != undefined) {

                if (!validarNIE($(this))) {
                    //El NIF no es válido
                    pixCampo.addClass("pix-no-valido");
                    if ($(this).parent().find(".pix-span-error").length == 0) {
                        if ($(this).attr("data-error") != undefined) {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html($(this).attr("data-error")));
                        } else {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html('Por favor, completa este campo'));
                        }
                    }
                }
            }


            if ($(this).attr("data-validar-nif-nie") != undefined) {

                var nifNieValido = false;
                nif_cif = $(this).val();
                if (nif_cif.length > 0) {//Compruebo si el primer caracter es número o letra.
                    var primerCaracter = nif_cif.substring(0, 1).toUpperCase();
                    if (!isNaN(primerCaracter)) {//Es un NIF.
                        nifNieValido = validarNIF($(this));
                    }
                    else {
                        if (primerCaracter == 'X' || primerCaracter == 'Y') {
                            //Es un NIE
                            nifNieValido = validarNIE($(this));
                        }
                    }
                }

                if (!nifNieValido) {
                    //El NIF/NIE no es válido
                    pixCampo.addClass("pix-no-valido");
                    if ($(this).parent().find(".pix-span-error").length == 0) {
                        if ($(this).attr("data-error") != undefined) {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html($(this).attr("data-error")));
                        } else {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html('Por favor, completa este campo'));
                        }
                    }
                }
            }

            if ($(this).attr("data-validar-nif-nie-cif") != undefined) {
                nif_cif = $(this).val();
                if (!checkNIFv2(nif_cif)) {
                    pixCampo.addClass("pix-no-valido");
                    if ($(this).parent().find(".pix-span-error").length == 0) {
                        if ($(this).attr("data-error") != undefined) {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html($(this).attr("data-error")));
                        } else {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html('Por favor, completa este campo'));
                        }
                    }
                }
            }

            //Nueva validación para emails 24/08/2021
            //Validación estricta (comprueba con la lista de top domains del ICANN)
            if ($(this).attr("data-validar-email-estricto") != undefined) {
                if (!validarEmailModoEstricto($(this))) {
                    //El email no es válido
                    pixCampo.addClass("pix-no-valido");
                    if ($(this).parent().find(".pix-span-error").length == 0) {
                        if ($(this).attr("data-error") != undefined) {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html($(this).attr("data-error")));
                        } else {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html('Por favor, introduce un email válido'));
                        }
                    }
                }
            }

            //Nueva validación para emails 24/08/2021
            //Validación NO estricta 
            if ($(this).attr('type') != undefined && ($(this).attr('type').toLowerCase() == 'email')) {
                if (!validarEmailModoNoEstricto($(this))) {
                    //El email no es válido
                    pixCampo.addClass("pix-no-valido");
                    if ($(this).parent().find(".pix-span-error").length == 0) {
                        if ($(this).attr("data-error") != undefined) {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html($(this).attr("data-error")));
                        } else {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html('Por favor, introduce un email válido'));
                        }
                    }
                }
            }
        });



    $(".pix-campo input, .pix-campo textarea").each(function () {
        if ($(this).val() != '') {
            $(this).parent().addClass("pix-relleno");
        } else {
            $(this).parent().removeClass("pix-relleno");
        }
        if ($(this).is("textarea")) {
            $(this).parent().addClass("pix-textarea");
        }
        if ($(this).attr("placeholder") != undefined && $(this).attr("placeholder") != '') {
            $(this).parent().addClass("pix-label-fija");
        }

        if (!isNaN($(this).attr("maxlength")) && $(this).attr("maxlength") < 10000 && ($(this).attr("data-contador") == undefined || $(this).attr("data-contador").toLowerCase == false)) {
            if ($(this).parent().find(".pix-contador-caracteres").length == 0) {
                var contadorCaracteres = $("<div>", { 'class': 'pix-contador-caracteres' }).html($(this).val().length + '/' + $(this).attr("maxlength"));
                $(this).parent().append(contadorCaracteres);
            }
        }

        if ($(this).attr("data-info") != undefined) {
            if ($(this).parent().find(".pix-texto-info").length == 0) {
                var textoInfo = $("<div>", { 'class': 'pix-texto-info' }).html($(this).attr("data-info"));
                $(this).parent().append(textoInfo);
            }
        }
    });

    $("body").addClass("pix-form-cargado");


}
/*Poner la clase pix-validar-form a los controles que deban desencadenar la validación del formulario,
 por ejemplo al botón de grabar.*/
$(".pix-validar-form").click(function (e) {

    var camposNoValidos = 0;
    if ($(".pix-campo").length > 0) {
        $("body").addClass("cargando");
    }

    var idContenedor = undefined;
    if ($(this).attr('data-validar-id-contenedor') != undefined) {

        idContenedor = $('#' + $(this).attr('data-validar-id-contenedor'));
    }

    validarFormulario(e, camposNoValidos, idContenedor);

});

function validarFormulario(e, camposNoValidos, elementoContenedor) {

    camposNoValidos = 0;
    try {

        var camposValidar = [];

        camposValidar = $(".pix-campo input, .pix-campo select, .pix-campo textarea").not('.pix-campo input[type=hidden]');

        if (elementoContenedor != undefined) {

            camposValidar = elementoContenedor.find('.pix-campo input, .pix-campo select, .pix-campo textarea').not('.pix-campo input[type=hidden]');
        }

        $(camposValidar).each(function () {
            var pixCampo = $(this).closest('.pix-campo');
            if (($(this)[0].validity && !$(this)[0].validity.valid) || ($(this).attr("data-required") == "required" && $(this).val() == '')) {
                //Html5 devuelve que es inválido

                camposNoValidos++;
                pixCampo.addClass("pix-no-valido");
                if ($(this).parent().find(".pix-span-error").length == 0) {
                    if ($(this).attr("data-error") != undefined) {
                        pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html($(this).attr("data-error")));
                    } else {
                        if ($(this).attr('type') != undefined && ($(this).attr('type').toLowerCase() == 'email')) {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html('Por favor, introduce un email válido'));
                        }
                        else {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html('Por favor, completa este campo'));
                        }
                    }
                }
            } else {
                pixCampo.find(".pix-span-error").remove();
                pixCampo.removeClass("pix-no-valido");
            }

            if ($(this).attr("data-validar-nif") != undefined) {

                if (!validarNIF($(this))) {
                    //El NIF no es válido
                    camposNoValidos++;
                    pixCampo.addClass("pix-no-valido");
                    if ($(this).parent().find(".pix-span-error").length == 0) {
                        if ($(this).attr("data-error") != undefined) {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html($(this).attr("data-error")));
                        } else {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html('Por favor, completa este campo'));
                        }
                    }
                }
            }

            if ($(this).attr("data-validar-nie") != undefined) {

                if (!validarNIE($(this))) {
                    //El NIF no es válido
                    camposNoValidos++;
                    pixCampo.addClass("pix-no-valido");
                    if ($(this).parent().find(".pix-span-error").length == 0) {
                        if ($(this).attr("data-error") != undefined) {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html($(this).attr("data-error")));
                        } else {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html('Por favor, completa este campo'));
                        }
                    }
                }
            }

            if ($(this).attr("data-validar-nif-nie") != undefined) {

                var nifNieValido = false;
                nif_cif = $(this).val();
                if (nif_cif.length > 0) {//Compruebo si el primer caracter es número o letra.
                    var primerCaracter = nif_cif.substring(0, 1).toUpperCase();
                    if (!isNaN(primerCaracter)) {//Es un NIF.
                        nifNieValido = validarNIF($(this));
                    }
                    else {
                        if (primerCaracter == 'X' || primerCaracter == 'Y') {
                            //Es un NIE
                            nifNieValido = validarNIE($(this));
                        }
                    }
                }

                if (!nifNieValido) {
                    //El NIF/NIE no es válido
                    camposNoValidos++;
                    pixCampo.addClass("pix-no-valido");
                    if ($(this).parent().find(".pix-span-error").length == 0) {
                        if ($(this).attr("data-error") != undefined) {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html($(this).attr("data-error")));
                        } else {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html('Por favor, completa este campo'));
                        }
                    }
                }
            }

            if ($(this).attr("data-validar-nif-nie-cif") != undefined) {
                nif_cif = $(this).val();
                if (!checkNIFv2(nif_cif)) {
                    camposNoValidos++;
                    pixCampo.addClass("pix-no-valido");
                    if ($(this).parent().find(".pix-span-error").length == 0) {
                        if ($(this).attr("data-error") != undefined) {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html($(this).attr("data-error")));
                        } else {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html('Por favor, completa este campo'));
                        }
                    }
                }
            }



            //Nueva validacion para emails 24/08/2021
            //Validación estricta (comprueba con la lista de top domains del ICANN)
            if ($(this).attr("data-validar-email-estricto") != undefined) {
                if (!validarEmailModoEstricto($(this))) {
                    //El email no es válido
                    camposNoValidos++;
                    pixCampo.addClass("pix-no-valido");
                    if ($(this).parent().find(".pix-span-error").length == 0) {
                        if ($(this).attr("data-error") != undefined) {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html($(this).attr("data-error")));
                        } else {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html('Por favor, introduce un email válido'));
                        }
                    }
                }
            }

            //Nueva validacion para emails 24/08/2021
            //Validación NO estricta 
            if ($(this).attr('type') != undefined && ($(this).attr('type').toLowerCase() == 'email')) {
                if (!validarEmailModoNoEstricto($(this))) {
                    //El email no es válido
                    camposNoValidos++;
                    pixCampo.addClass("pix-no-valido");
                    if ($(this).parent().find(".pix-span-error").length == 0) {
                        if ($(this).attr("data-error") != undefined) {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html($(this).attr("data-error")));
                        } else {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html('Por favor, introduce un email válido'));
                        }
                    }
                }
            }
        });
        $('.pix-campo input[type=hidden]').each(function () {
            //Validación file required
            var pixCampo = $(this).closest('.pix-campo');
            if ($(this).attr("data-required") != undefined && $(this).attr("data-required") == "required") {
                if ($(this).val().trim() == "") {
                    camposNoValidos++;
                    pixCampo.addClass("pix-no-valido");
                    if ($(this).parent().find(".pix-span-error").length == 0) {
                        if ($(this).attr("data-error") != undefined) {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html($(this).attr("data-error")));
                        } else {
                            pixCampo.append($("<span>", { 'class': 'pix-span-error' }).html('Por favor, completa este campo'));
                        }
                    }
                }
            }
        });


        if (camposNoValidos > 0) {
            $("body").removeClass("cargando");
            e.preventDefault();
            try {
                if ($(".pix-no-valido").first().length > 0) {

                    var tabActual = $(".pix-no-valido").first().closest('.pix-tab');
                    if (tabActual.length > 0) {
                        $(".pix-tab").removeClass('activo');
                        $(".pix-tarjeta-tabs a").removeClass('activo');
                        $('.pix-tarjeta-tabs a[href="#' + tabActual.attr('id') + '"]').addClass('activo');
                        tabActual.addClass('activo');
                    }


                    var tabTablaActual = $(".pix-no-valido").first().closest('.pix-tabla-tab');
                    if (tabTablaActual.length > 0) {
                        var contenedor = tabTablaActual.parent();
                        contenedor.find(".pix-tabla-tab").removeClass('activo');
                        contenedor.find(".pix-tabla-indice-tabs a").removeClass('activo');
                        contenedor.find('.pix-tabla-indice-tabs a[href="#' + tabTablaActual.attr('id') + '"]').addClass('activo');
                        tabTablaActual.addClass('activo');
                    }


                    $("html, body").stop().animate({ scrollTop: $(".pix-no-valido").first().offset().top - 180 }, 250, 'swing', function () {
                        $(".pix-no-valido").first().find("input").focus();
                    });
                }
            }
            catch (ex) {
                console.error('Error al poner el foco en el primer campo no válido.', ex);
            }
        }

    } catch (ex) {
        $("body").removeClass("cargando");
        console.error('Error al validar formulario', ex);
    }
    return camposNoValidos == 0;
}


function validarNIF(txtNif) {
    cadena = "TRWAGMYFPDXBNJZSQVHLCKET";
    var resultado = false;
    try {
        var nif = txtNif.val();
        nif = nif.toUpperCase();
        if (nif.length > 6) {

            if (nif.length == 9) {//El NIF llega con la longitud correcta.
                letraAux = nif.substring(8, 9);
                letraAux = letraAux.toUpperCase();
                nif = nif.substring(0, 8);
                if (!isNaN(nif)) {
                    posicion = nif % 23;
                    letra = cadena.substring(posicion, posicion + 1);
                    if (letra == letraAux) {
                        //console.log("NIF correcto (1)");
                        resultado = true;
                    }
                }
            }
            else {//En NIF no llega con la longitud correcta, le añado ceros a la izquierda.
                ultimoCaracter = nif.substring(nif.length - 1, nif.length);
                if (!isNaN(ultimoCaracter)) {//No tiene letra, añado ceros hasta llegar a 8 dígitos.
                    while (nif.length < 8) { nif = '0' + nif; }
                }
                else {//Tiene letra, añado ceros hasta llegar a 9 dígitos.
                    while (nif.length < 9) { nif = '0' + nif; }
                }
                posicion = nif % 23;
                letra = cadena.substring(posicion, posicion + 1);
                if (nif.length == 8) {//No tenía letra, así que se la añado.
                    nif += letra;
                }
                //Tras rellenarlo, compruebo que el NIF es correcto.
                letraAux = nif.substring(8, 9);
                letraAux = letraAux.toUpperCase();
                nif = nif.substring(0, 8);
                if (!isNaN(nif)) {
                    posicion = nif % 23;
                    letra = cadena.substring(posicion, posicion + 1);
                    if (letra == letraAux) {
                        console.log("NIF correcto (2)");
                        resultado = true;
                        txtNif.val(nif + letraAux.toUpperCase());
                    }
                }
            }
        }
    } catch (ex) { console.error(ex); }
    return resultado;
}




function validarNIE(txtNie) {

    cadena = "TRWAGMYFPDXBNJZSQVHLCKET";
    var resultado = false;
    try {
        var nie = txtNie.val().toUpperCase();
        var nif = nif = nie.substring(1, 8);

        var primeraLetra = nie.substr(0, 1);
        if (primeraLetra == 'X' || primeraLetra == 'Y') {

            if (nie.length == 9) {
                //El NIE llega con la longitud correcta.
                letraAux = nie.substring(8, 9);
                letraAux = letraAux.toUpperCase();

                if (!isNaN(nif)) {
                    posicion = nif % 23;
                    letra = cadena.substring(posicion, posicion + 1);
                    if (letra == letraAux) {
                        console.log("NIE correcto (1)");
                        //Ahora el primer carácter puede ser "X" o "Y"
                        txtNie.val(primeraLetra + nif + letra);
                        resultado = true;
                    }
                }

            }
            else {//En NIE no llega con la longitud correcta, le añado ceros a la izquierda.
                ultimoCaracter = nie.substring(nie.length - 1, nie.length);
                posicion = nif % 23;
                letra = cadena.substring(posicion, posicion + 1);
                if (nie.length == 8) {//No tenía letra, así que se la añado.
                    nie += letra;
                }
                console.log(nie);
                //Tras rellenarlo, compruebo que el NIE es correcto.
                letraAux = nie.substring(8, 9);
                letraAux = letraAux.toUpperCase();


                if (!isNaN(nif)) {
                    posicion = nif % 23;
                    letra = cadena.substring(posicion, posicion + 1);
                    //Ahora el primer carácter puede ser "X" o "Y"

                    if (letra == letraAux) {
                        console.log("NIE correcto (2)");
                        //Ahora el primer carácter puede ser "X" o "Y"
                        txtNie.val(primeraLetra + nif + letra);
                        resultado = true;
                    }
                }
            }
        }
    } catch (ex) { console.error(ex); }
    return resultado;





}


//Nueva funcion de validacion de email que tambien comprueba el top domain de la lista ICANN 24/08/2021 (ademas de @ y .)
function validarEmailModoEstricto(txtEmail) {

    try {


        if (txtEmail.val().trim() == '') {
            return true;
        }

        var valido = validarEmailModoNoEstricto(txtEmail);

        //Además -> Validacion de top domain
        if (valido) {

            var topLevelDomain = (txtEmail.val()).substring(txtEmail.val().lastIndexOf("@") + 1).split(".").pop();

            var comprobarSiTopLevelDomainEsValidoSegunLaListaICANN = function () {
                var esValido = false;
                topLevelDomainList.forEach(element => {
                    if (topLevelDomain.trim().toLowerCase() == (element).trim().toLowerCase()) {
                        esValido = true;
                    }
                });
                return esValido;
            }

            if (topLevelDomain) {
                valido = valido && comprobarSiTopLevelDomainEsValidoSegunLaListaICANN();
            }
            else {
                valido = false;
            }

        }
        return valido;
    }
    catch (e) {
        console.error(e);
        return false;
    }
}

//Nueva funcion de validacion de email 

function validarEmailModoNoEstricto(txtEmail) {

    //Tener @
    //Tener .
    //@ antes que un .
    //No puede ser vacio 
    //No puede haber dos puntos seguidos
    //No puede haber de @ y . de forma seguida (ej -> @. o .@)

    try {
        var email = txtEmail.val();

        if (email.trim() == '') {
            return true;
        }

        var arroba = email.indexOf("@");
        var punto = email.lastIndexOf(".");
        var dot_splits = email.split(".");

        //https://www.aspsnippets.com/Articles/Email-validation-without-using-Regular-Expression-in-JavaScript.aspx
        //Comprueba que no hay dos puntos seguidos
        for (var i = 0; i < dot_splits.length; i++) {
            if (dot_splits[i].length == 0) {
                return false;
            }
        }

        //No @ y . seguidos (@. o .@)
        var arroba_index = email.indexOf("@");
        while (arroba_index >= 0) {
            var punto_index = email.indexOf(".");
            while (punto_index >= 0) {
                if (Math.abs(arroba_index - punto_index) <= 1) {
                    return false;
                }
                punto_index = email.indexOf(".", punto_index + 1);
            }
            arroba_index = email.indexOf("@", arroba_index + 1);
        }

        if (arroba < 1 || punto < 1 || (punto - arroba < 2) || email === "") {
            return false;
        }

        return true;

    } catch (e) {
        console.error(e);
        return false;
    }

}


























cargarCampos();


function comprobarHash() {
    var hash = window.location.hash;
    if (hash != '' && hash != '#') {
        $(".pix-tab.activo").removeClass('activo');
        $(hash + ':first').addClass("activo").removeAttr('style');
        $(".pix-tarjeta-tabs a").removeClass('activo').removeAttr('style');
        $('.pix-tarjeta-tabs a[href="' + hash + '"]').addClass('activo');

        $('.pix-resultados-paginacion a').each(function () {
            if ($(this).attr('href').includes('#')) {
                $(this).attr('href', $(this).attr('href').substring(0, $(this).attr('href').lastIndexOf('#')));
            }
            if (!$(this).attr('href').includes('#')) {
                $(this).attr('href', $(this).attr('href') + location.hash);
            }
        });

    }
}


function actualizarPixTabs() {

    if ($(".pix-tarjeta-tabs").length > 0) {
        $(".pix-tarjeta-tabs a").not('[href="#"]').click(function (e) {
            e.preventDefault();

            if (!$(this).hasClass("activo")) {
                $(this).closest(".pix-tarjeta-tabs").find("a").not(this).removeClass("activo");
                $(this).toggleClass("activo");
                $(".pix-tab").removeClass("activo");
            }
            $($(".pix-tarjeta-tabs a.activo").attr('href')).addClass("activo");


            $(".pix-tab.activo [data-requerido-si-visible]").each(function () { $(this).attr('required', 'required') });
            $(".pix-tab").not('.activo').find('[data-requerido-si-visible]').each(function () { $(this).removeAttr('required') });

            if (history.pushState) {

                history.pushState(null, null, $(this).attr('href'));
                var offsetForm = $(this).closest('form').offset().top;
                var offsetTarjeta = $(this).closest('.pix-tarjeta-tabs').offset().top;
                if ($(".pix-tarjeta-tabs").attr('data-deshabilitar-scroll') == undefined) {
                    setTimeout(function () { $("body, html").scrollTop(offsetTarjeta - offsetForm - 16); }, 10)
                }
            }
            else {
                location.hash = $(this).attr('href');
            }

            $('.pix-resultados-paginacion a').each(function () {
                if ($(this).attr('href').includes('#')) {
                    $(this).attr('href', $(this).attr('href').substring(0, $(this).attr('href').lastIndexOf('#')));
                }
                if (!$(this).attr('href').includes('#')) {
                    $(this).attr('href', $(this).attr('href') + location.hash);
                }
            });
        });

        comprobarHash();
    }

    if ($(".pix-tarjeta-tabs a.activo").length == 0 && $(".pix-tarjeta-tabs a").length > 0) {
        $(".pix-tarjeta-tabs a").first().addClass("activo");
    }

    $(".pix-tarjeta-tabs a").not('.activo').each(function () {
        if ($(this).attr('href') != '#') {
            try {
                $($(this).attr('href')).removeClass("activo");
            }
            catch (ex) {
                console.error(ex);
            }
        }
    });

    $($(".pix-tarjeta-tabs a.activo").attr('href')).addClass("activo");
    $(".pix-tab.activo [data-requerido-si-visible]").each(function () { $(this).attr('required', 'required') });
    $(".pix-tab").not('.activo').find('[data-requerido-si-visible]').each(function () { $(this).removeAttr('required') });


}

$(document).ready(function () {
    setTimeout(function () { cargarCampos(); }, 50);
    $(".pix-resultados-paginacion a").not('.activo').click(function () { $("body").addClass("cargando"); });

    actualizarPixTabs();

    actualizarPixCambioIdioma();
    $('.cmbIdiomaContenido').trigger('change');
    $(".pix-cambio-idioma").change(function () {
        actualizarPixCambioIdioma();

        $("body").addClass('cargando');
        document.location = $(this).find(":selected").attr('data-url-idioma');

        try {
            Android.cambiarIdioma($(this).find(":selected").attr('data-id-idioma'));
        } catch (err) {
            //console.log("No Android interface");
        }

        try {
            window.webkit.messageHandlers.cambiarIdioma.postMessage($(this).find(":selected").attr('data-id-idioma'));
        } catch (err) {
            //console.log("No iOS interface");
        }
    });

    //Cargo campos dependientes
    $('select[data-dependiente]').trigger("change");
    ajustarContadoresCaracteres();

    inicializarPixTooltip();
    inicializarPixAcordeon();

    bindPixUploadExcel();
    bindPixUploadFotoPerfil();
    bindPixUploadGenericos();

    /*Cargo los inputs de tags*/
    $('.pix-tags input').each(function (e) {
        var querystring = ""
        var campo = $(this).closest('.pix-campo')
        if (campo.attr('data-tabla') != undefined && campo.attr('data-tabla') != '') {
            querystring += '&tabla=' + campo.attr('data-tabla')
        }
        if (campo.attr('data-campo-valor') != undefined && campo.attr('data-campo-valor') != '') {
            querystring += '&campo-valor=' + campo.attr('data-campo-valor')
        }
        if (campo.attr('data-campo-nombre') != undefined && campo.attr('data-campo-nombre') != '') {
            querystring += '&campo-nombre=' + campo.attr('data-campo-nombre')
        }
        if (campo.attr('data-campo-imagen') != undefined && campo.attr('data-campo-imagen') != '') {
            querystring += '&campo-imagen=' + campo.attr('data-campo-imagen')
        }
        if (campo.attr('data-campo-descripcion') != undefined && campo.attr('data-campo-descripcion') != '') {
            querystring += '&campo-descripcion=' + campo.attr('data-campo-descripcion')
        }
        if (campo.attr('data-campo-texto-detalle') != undefined && campo.attr('data-campo-texto-detalle') != '') {
            querystring += '&campo-texto-detalle=' + campo.attr('data-campo-texto-detalle')
        }
        var textoEliminar = campo.attr('data-texto-eliminar')
        var textoDuplicados = campo.attr('data-texto-duplicados')
        var textoPlaceholder = campo.attr('data-texto-placeholder')
        var minChars = campo.attr('data-min-chars')
        var maxChars = campo.attr('data-max-chars')

        $(this).tagsInput({
            autocomplete_url: '/pix-admin/pix-sistema/pix-sistema.ashx?funcion=autocompletar-tags-input' + querystring,
            autocomplete: { selectFirst: true, width: '200px', autoFill: true, minLength: minChars },
            'width': '100%',
            'interactive': true,
            'textoEliminar': textoEliminar,
            'textoDuplicados': textoDuplicados,
            'placeholder': textoPlaceholder,
            'removeWithBackspace': true,
            'minChars': minChars,
            'maxChars': maxChars
        });
    });
});


$('.cmbIdiomaContenido').change(function () {
    $(this).css({ 'background-image': 'url(' + $(this).find(':selected').attr('data-url-imagen') + ')' });
});

$('.cmbIdiomaContenido').trigger('change');

$(".cmbTraduccion").change(function (e) {

    if ($(this).val() == 0) {
        if (!confirm('¿Seguro que quieres eliminar el registro de este idioma?')) {
            $(this).val('');
            e.preventDefault();
            return false;
        }
    }

    $('body').addClass('cargando');
    console.log('Redirigiendo a ', $(this).find(':selected').attr('data-url'));
    document.location = $(this).find(':selected').attr('data-url');
});


$(".pix-btn-filtros-busqueda").click(function (e) {
    e.preventDefault();
    recargarBusqueda();
});

function recargarBusqueda() {

    var formValido = true;
    $(".pix-tarjeta-filtros :input, .pix-resultados-cabecera :input").not('.pix-ignorar-filtro').each(function () {
        if ($(this)[0].validity && !$(this)[0].validity.valid) { formValido = false; }
        if ($(this).attr('data-nombre-parametro') != undefined && $(this).attr('data-nombre-parametro') != '') {
            $(this).attr('name', $(this).attr('data-nombre-parametro'));
        }
    });
    if (formValido) {
        $("body").addClass("cargando");
        //Al hacer clic en el botón de buscar, redirijo a la misma URL con todos los filtros serializados en la querystring

        var urlRedirigir = window.location.href.split('#')[0];
        urlRedirigir = urlRedirigir.split('?')[0] + '?' + $(".pix-tarjeta-filtros :input[value!=''], .pix-resultados-cabecera :input[value!='']").not('.pix-ignorar-filtro').serialize();
        var urlParams = new URLSearchParams(window.location.search);

        var parametroId = urlParams.get('id');
        if (parametroId != undefined && parametroId != '') {
            urlRedirigir += '&id=' + parametroId;
        }

        for (var i = 5; i > 0; i--) {
            var indiceStr = i;
            if (indiceStr == 1) {
                indiceStr = '';
            }
            var parametroReturnUrl = urlParams.get('ReturnUrl' + indiceStr);
            if (parametroReturnUrl != undefined && parametroReturnUrl != '') {
                urlRedirigir += '&ReturnUrl' + indiceStr + '=' + parametroReturnUrl;
            }
        }
        console.log('Redirigiendo a ', urlRedirigir);
        var urlActual = window.location.href;
        if (urlActual.includes("#")) {
            setTimeout(function () { $("body").removeClass("cargando"); }, 1000);

            var hash = urlActual.substring(urlActual.indexOf('#'), urlActual.length);
            urlRedirigir += hash;
            if (hash != '' && hash != '#') {
                $(".pix-tab.activo").hide().removeClass('activo');
                $(hash + ':first').addClass("activo").removeAttr('style');
                $(".pix-tarjeta-tabs a").removeClass('activo').removeAttr('style');
                $('.pix-tarjeta-tabs a[href="' + hash + '"]').addClass('activo');
            }
        }
        window.location = urlRedirigir;
    }
}


$(".pix-tarjeta-filtros :input, .pix-resultados-cabecera :input").not('.pix-ignorar-filtro').each(function () {


    if ($.urlParam($(this).attr("data-nombre-parametro")) != undefined && $.urlParam($(this).attr("data-nombre-parametro")) != 'null' && $.urlParam($(this).attr("data-nombre-parametro")) != '') {
        //Relleno los input con los valores que vienen en la querystring
        $(this).val($.urlParam($(this).attr("data-nombre-parametro")));
        if ($(this).attr('type') != undefined && $(this).attr('type').toLowerCase() == "checkbox") {
            $(this).prop('checked', $.urlParam($(this).attr("data-nombre-parametro")) == "1");
        }
    }

    if ($.urlParam($(this).attr("name")) != undefined && $.urlParam($(this).attr("name")) != 'null' && $.urlParam($(this).attr("name")) != '') {
        //Relleno los input con los valores que vienen en la querystring
        $(this).val($.urlParam($(this).attr("name")));
        if ($(this).attr('type') != undefined && $(this).attr('type').toLowerCase() == "checkbox") {
            $(this).prop('checked', $.urlParam($(this).attr("name")) == "1");
        }
    }

    if ($(this).attr("data-recargar") == 'true') {
        $(this).change(function () {
            if ($(".pix-btn-filtros-busqueda").length == 0) {
                //No hay botón, recargo la búsqueda directamente
                recargarBusqueda();
                //console.log('No es posible recargar el listado. No se encontró el botón "buscar".');
            } else {
                $(".pix-btn-filtros-busqueda").trigger("click");
            }
        });
    }
});

$(".pix-tarjeta-filtros :input, .pix-resultados-cabecera :input").keydown(function (e) {
    if (e.keyCode == 13) {
        if ($(".pix-btn-filtros-busqueda").length == 0) {
            //No hay botón, recargo la búsqueda directamente
            recargarBusqueda();
        } else {
            $(".pix-btn-filtros-busqueda").trigger("click"); e.preventDefault(); e.stopPropagation();
        }
    }
});

$(".chk-marcar-desmarcar").change(function () {
    $('input[data-grupo=' + $(this).attr("data-grupo") + ']').prop('checked', $(this).is(":checked"));
});



function actualizarPixCambioIdioma() {
    if ($(".pix-cambio-idioma").hasClass('conBandera')) {
        $(".pix-cambio-idioma").css({ 'background-image': 'url(' + $(".pix-cambio-idioma").find(":selected").attr('data-url-imagen') + ')' });
    }
}



function inicializarListado() {
    console.log('Inicializo');

    $(".pix-btn-mini-menu").unbind('click').click(function (e) {
        console.log('Pix mini menu');
        e.preventDefault();
        e.stopPropagation();
        var desplegar = false;
        if (!$(this).parent().hasClass("pix-mini-menu-activo")) {
            desplegar = true;
        }
        $(".pix-mini-menu-activo").removeClass("pix-mini-menu-activo");
        if (desplegar) {

            $(this).parent().addClass("pix-mini-menu-activo");
            if (!$(this).parent().find('.pix-mini-menu').hasClass('pix-despliegue-inferior')) {
                var posicion = $(this).height() + $(this).offset().top + $(this).parent().find(".pix-mini-menu").height() + $("header").height();
                var scroll = $(window).height() + $(window).scrollTop();
                if (posicion > scroll) {
                    $(this).parent().addClass("pix-despliegue-superior");
                } else {
                    $(this).parent().removeClass("pix-despliegue-superior");
                }
            }
        }
    });
    $(".pix-borrar-registro").unbind('click').click(function (e) {
        e.preventDefault();
        if (confirm('ATENCIÓN\n\n¿Seguro que quieres borrar este registro?')) {
            $("body").addClass("cargando");
            var tabla = $(this).attr('data-tabla');
            var idSeleccionados = [];
            var registro = $('.pix-registro[data-id=' + $(this).attr("data-id") + ']');
            idSeleccionados.push($(this).attr("data-id"));
            jQuery.ajax({
                type: "POST",
                url: "/pix-admin/pix-sistema/pix-sistema.ashx",
                data: { 'funcion': 'borrar-seleccion', 'tabla': tabla, 'idSeleccionados': JSON.stringify(idSeleccionados) },
                success: function (resultado) {
                    //console.log(resultado);
                    $("body").removeClass("cargando");
                    if (resultado.VALOR == 1) {
                        $(idSeleccionados).each(function (i, val) {
                            var registro = $('.pix-registro[data-id=' + val + ']');
                            registro.css('display', 'block').slideUp(200, function () {
                                registro.remove();
                                //Hago esto para evitar que sigan saliendo registros borrados cuando vuelvo atrás en el navegador
                                location.reload();
                            });
                        });
                    } else {
                        mostrarSnackbar(resultado.TEXTO, 'div-snackbar-rojo');
                    }
                }
            });

            registro.css('display', 'block').slideUp(200, function () {
                //Hago esto para evitar que sigan saliendo registros borrados cuando vuelvo atrás en el navegador
                location.reload();
            });
        } else {
            $("body").removeClass("cargando");
        }
    });
}

inicializarListado();


$("body").click(function () {
    $(".pix-mini-menu-activo").removeClass("pix-mini-menu-activo");
});
$(window).scroll(function () {
    $(".pix-resultados").each(function () {
        if ($(window).scrollTop() + $(this).find(".pix-resultados-cabecera").height() > $(this).offset().top) {
            if ($(".pix-resultados.fijo").length == 0) {
                $(this).addClass("fijo");
            }
        } else {
            $(this).removeClass("fijo");
        }
    });
});
$(window).trigger("scroll");



function eliminarParametroUrl(key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
}

$(".pix-accion-adicional").not('.pix-accion-redireccion').click(function (e) {
    e.preventDefault();
    $("body").addClass("cargando");
    $.ajax({
        type: "POST",
        url: $(this).attr("href"),
        success: function (resultado) {
            if (resultado.VALOR == 1 || resultado.VALOR.toString().toLowerCase() == 'true') {
                var UrlDestino = window.location.href;
                UrlDestino = eliminarParametroUrl('msg', UrlDestino);
                var union = '?';
                if (UrlDestino.indexOf('?') > 0) {
                    union = '&';
                }
                if (UrlDestino.includes("#")) {
                    window.location = UrlDestino.substring(0, UrlDestino.indexOf('#')) + union + 'msg=' + resultado.TEXTO + UrlDestino.substring(UrlDestino.indexOf('#'), UrlDestino.length);

                } else {
                    window.location = UrlDestino + union + 'msg=' + resultado.TEXTO;
                }
            } else {
                $("body").removeClass("cargando");
                mostrarSnackbar(resultado.TEXTO, 'div-snackbar-rojo');
            }
        }
    });
});

function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}


$(".pix-cmb-acciones").change(function () {
    $("body").addClass("cargando");
    var idSeleccionados = [];
    var tabla = $(this).attr('data-tabla');
    $('.pix-check input[data-grupo=' + $(this).attr('data-grupo') + ']').not(".chk-marcar-desmarcar").each(function () {
        if ($(this).is(":checked")) {
            idSeleccionados.push($(this).attr('data-id'));
        }
    });

    switch ($(this).val()) {

        case 'exportar-resultados':
            var parametros;
            try {
                parametros = parseQuery(window.location.search);
            } catch (ex) { console.error(ex) };
            parametros['tabla'] = tabla;
            parametros['funcion'] = 'exportar-resultados';
            $.ajax({
                type: "POST",
                url: document.location,
                data: parametros,
                success: function (resultado) {
                    $("body").removeClass("cargando");
                    resultado = JSON.parse(resultado);
                    if (resultado.VALOR == 1 || resultado.VALOR.toString().toLowerCase() == 'true') {
                        window.location = resultado.TEXTO;
                    } else {
                        mostrarSnackbar(resultado.TEXTO, 'div-snackbar-rojo');
                    }
                },
                error: function (err) {
                    $("body").removeClass("cargando");
                    console.error(err);
                }
            });
            break;

        case 'exportar-todos':
            var parametros;
            try {
                parametros = parseQuery(window.location.search);
            } catch (ex) { console.error(ex) };
            parametros['tabla'] = tabla;
            parametros['funcion'] = 'exportar-todos';
            $.ajax({
                type: "POST",
                url: "/pix-admin/pix-sistema/pix-sistema.ashx",
                data: parametros,
                success: function (resultado) {
                    $("body").removeClass("cargando");
                    if (resultado.VALOR == 1 || resultado.VALOR.toString().toLowerCase() == 'true') {
                        window.location = resultado.TEXTO;
                    } else {
                        mostrarSnackbar(resultado.TEXTO, 'div-snackbar-rojo');
                    }
                }, error: function (err) {

                    $("body").removeClass("cargando");
                    console.error(err);
                }
            });
            break;
        case 'exportar-seleccion':
            if (idSeleccionados == '') {
                $("body").removeClass("cargando");
                mostrarSnackbar('Por favor, selecciona como mínimo un registro.');
            } else {
                $.ajax({
                    type: "POST",
                    url: "/pix-admin/pix-sistema/pix-sistema.ashx",
                    data: { 'funcion': 'exportar-seleccion', 'tabla': tabla, 'idSeleccionados': JSON.stringify(idSeleccionados) },
                    success: function (resultado) {
                        $("body").removeClass("cargando");
                        if (resultado.VALOR == 1 || resultado.VALOR.toString().toLowerCase() == 'true') {
                            window.location = resultado.TEXTO;
                        } else {
                            mostrarSnackbar(resultado.TEXTO, 'div-snackbar-rojo');
                        }
                    }
                });
            }
            break;
        case 'borrar-seleccion':
            if (idSeleccionados == '') {
                $("body").removeClass("cargando");
                mostrarSnackbar('Por favor, selecciona como mínimo un registro.');
            } else {
                if (confirm('ATENCIÓN\n\n¿Seguro que quieres borrar ' + idSeleccionados.length + ' registro(s)?')) {
                    $.ajax({
                        type: "POST",
                        url: "/pix-admin/pix-sistema/pix-sistema.ashx",
                        data: { 'funcion': 'borrar-seleccion', 'tabla': tabla, 'idSeleccionados': JSON.stringify(idSeleccionados) },
                        success: function (resultado) {
                            $("body").removeClass("cargando");
                            if (resultado.VALOR == 1 || resultado.VALOR.toString().toLowerCase() == 'true') {
                                $(idSeleccionados).each(function (i, val) {
                                    var registro = $('.pix-registro[data-id=' + val + ']');
                                    registro.css('display', 'block').slideUp(200, function () {
                                        registro.remove();
                                        //Hago esto para evitar que sigan saliendo registros borrados cuando vuelvo atrás en el navegador
                                        location.reload();
                                    });
                                });
                            } else {
                                alert(resultado.TEXTO);
                            }
                        }
                    });
                }
            }
            break;
        default:

            var valor = $(this).val();
            if (idSeleccionados == '' && !valor.indexOf('minRegistros=0') > 0) {
                $("body").removeClass("cargando");
                mostrarSnackbar('Por favor, selecciona como mínimo un registro.');
            } else {



                if (jQuery(this).val().indexOf('.ashx') > 0) {

                    jQuery.ajax({
                        type: "POST",
                        url: jQuery(this).val(),
                        data: { 'idSeleccionados': JSON.stringify(idSeleccionados) },
                        success: function (resultado) {
                            jQuery("body").removeClass("cargando");
                            if (resultado.VALOR == 1 || resultado.VALOR.toString().toLowerCase() == 'true') {
                                var UrlDestino = window.location.href;
                                UrlDestino = eliminarParametroUrl('msg', UrlDestino);
                                var union = '?';
                                if (UrlDestino.indexOf('?') > 0) {
                                    union = '&';
                                }
                                if (valor.indexOf('redirigir=1') > 0) {
                                    window.location = resultado.TEXTO;
                                } else {
                                    window.location = UrlDestino + union + 'msg=' + resultado.TEXTO;
                                }
                            } else {
                                mostrarSnackbar(resultado.TEXTO, 'div-snackbar-rojo');
                            }
                            if (undefined != resultado.TEXTO_EXTENDIDO) {

                                if (resultado.TEXTO_EXTENDIDO != '') {
                                    $(resultado.SELECTOR_DESTINO_TEXTO_EXTENDIDO).append(resultado.TEXTO_EXTENDIDO);
                                }
                            }
                        }
                    });
                } else {

                    var urlDestino = jQuery(this).val();
                    if (!jQuery(this).val().endsWith('?')) {
                        urlDestino += '?';
                    }

                    window.location = urlDestino + 'idSeleccionados=' + idSeleccionados.join();
                }
            }
            break;
    }
    //Devuelvo el combo de acciones a su posición inicial
    $(this).val(-1);
});






function ajustarContadoresCaracteres() {
    $(".pix-campo input, .pix-campo textarea").each(function (e) {
        var pixCampo = $(this).parent();
        if (!isNaN($(this).attr("maxlength")) && $(this).attr("maxlength") < 10000) {
            var pixContadorCaracteres = pixCampo.find(".pix-contador-caracteres");
            var caracteres = $(this).val().length;
            if (caracteres > $(this).attr("maxlength")) {
                caracteres = $(this).attr("maxlength");
            }
            pixContadorCaracteres.html(caracteres + '/' + $(this).attr("maxlength"));
        }
    });
};


$('select[data-dependiente]').change(function (e) {
    var campoChange = $(this)
    $('select[data-campo=' + $(this).data('dependiente') + ']').each(function (e) {
        var campoDependiente = $(this);
        var value = campoDependiente.val();
        campoDependiente.empty();

        $.ajax({
            type: 'POST',
            url: '/pix-admin/pix-sistema/pix-sistema.ashx',
            data: { 'funcion': 'cargar-campo-dependiente', 'dependienteTabla': campoChange.data('dependiente-tabla'), 'dependienteTablaNombrePrincipal': campoChange.data('dependiente-campo-nombre'), 'dependienteTablaCampoCruzar': campoChange.data('dependiente-campo-cruzar'), 'dependienteValorCampoCruzar': campoChange.val() },
            success: function (resultado) {
                campoDependiente.empty();
                if (resultado.VALOR == 1 || resultado.VALOR.toString().toLowerCase() == 'true') {
                    campoDependiente.append(new Option("- selecciona -", "", true));
                    $(resultado.TEXTO).each(function (indice, elemento) {
                        campoDependiente.append(new Option(elemento.NOMBRE, elemento.ID));
                    });
                } else {
                    campoDependiente.append(new Option("- sin resultados -", "", true));
                }
                if (campoDependiente.attr('data-valor') != undefined) {
                    value = campoDependiente.attr('data-valor');
                }
                campoDependiente.val(value);
                if (campoDependiente.val() != value) {
                    campoDependiente.val('');
                }
                campoDependiente.trigger("change");
            }, error: function (resultado) {
                console.error(resultado);
            }
        });

    });

});



















!function (e) { "use strict"; "function" == typeof define && define.amd ? define(["jquery", "jquery.ui.widget"], e) : e(window.jQuery) }(function (e) { "use strict"; function t(t) { var i = "dragover" === t; return function (r) { r.dataTransfer = r.originalEvent && r.originalEvent.dataTransfer; var n = r.dataTransfer; n && -1 !== e.inArray("Files", n.types) && !1 !== this._trigger(t, e.Event(t, { delegatedEvent: r })) && (r.preventDefault(), i && (n.dropEffect = "copy")) } } e.support.fileInput = !(new RegExp("(Android (1\\.[0156]|2\\.[01]))|(Windows Phone (OS 7|8\\.0))|(XBLWP)|(ZuneWP)|(WPDesktop)|(w(eb)?OSBrowser)|(webOS)|(Kindle/(1\\.0|2\\.[05]|3\\.0))").test(window.navigator.userAgent) || e('<input type="file">').prop("disabled")), e.support.xhrFileUpload = !(!window.ProgressEvent || !window.FileReader), e.support.xhrFormDataFileUpload = !!window.FormData, e.support.blobSlice = window.Blob && (Blob.prototype.slice || Blob.prototype.webkitSlice || Blob.prototype.mozSlice), e.widget("blueimp.fileupload", { options: { dropZone: e(document), pasteZone: e(document), fileInput: void 0, replaceFileInput: !0, paramName: void 0, singleFileUploads: !0, limitMultiFileUploads: void 0, limitMultiFileUploadSize: void 0, limitMultiFileUploadSizeOverhead: 512, sequentialUploads: !1, limitConcurrentUploads: void 0, forceIframeTransport: !1, redirect: void 0, redirectParamName: void 0, postMessage: void 0, multipart: !0, maxChunkSize: void 0, uploadedBytes: void 0, recalculateProgress: !0, progressInterval: 100, bitrateInterval: 500, autoUpload: !0, messages: { uploadedBytes: "Uploaded bytes exceed file size" }, i18n: function (t, i) { return t = this.messages[t] || t.toString(), i && e.each(i, function (e, i) { t = t.replace("{" + e + "}", i) }), t }, formData: function (e) { return e.serializeArray() }, add: function (t, i) { if (t.isDefaultPrevented()) return !1; (i.autoUpload || !1 !== i.autoUpload && e(this).fileupload("option", "autoUpload")) && i.process().done(function () { i.submit() }) }, processData: !1, contentType: !1, cache: !1 }, _specialOptions: ["fileInput", "dropZone", "pasteZone", "multipart", "forceIframeTransport"], _blobSlice: e.support.blobSlice && function () { return (this.slice || this.webkitSlice || this.mozSlice).apply(this, arguments) }, _BitrateTimer: function () { this.timestamp = Date.now ? Date.now() : (new Date).getTime(), this.loaded = 0, this.bitrate = 0, this.getBitrate = function (e, t, i) { var r = e - this.timestamp; return (!this.bitrate || !i || r > i) && (this.bitrate = (t - this.loaded) * (1e3 / r) * 8, this.loaded = t, this.timestamp = e), this.bitrate } }, _isXHRUpload: function (t) { return !t.forceIframeTransport && (!t.multipart && e.support.xhrFileUpload || e.support.xhrFormDataFileUpload) }, _getFormData: function (t) { var i; return "function" === e.type(t.formData) ? t.formData(t.form) : e.isArray(t.formData) ? t.formData : "object" === e.type(t.formData) ? (i = [], e.each(t.formData, function (e, t) { i.push({ name: e, value: t }) }), i) : [] }, _getTotal: function (t) { var i = 0; return e.each(t, function (e, t) { i += t.size || 1 }), i }, _initProgressObject: function (t) { var i = { loaded: 0, total: 0, bitrate: 0 }; t._progress ? e.extend(t._progress, i) : t._progress = i }, _initResponseObject: function (e) { var t; if (e._response) for (t in e._response) e._response.hasOwnProperty(t) && delete e._response[t]; else e._response = {} }, _onProgress: function (t, i) { if (t.lengthComputable) { var r, n = Date.now ? Date.now() : (new Date).getTime(); if (i._time && i.progressInterval && n - i._time < i.progressInterval && t.loaded !== t.total) return; i._time = n, r = Math.floor(t.loaded / t.total * (i.chunkSize || i._progress.total)) + (i.uploadedBytes || 0), this._progress.loaded += r - i._progress.loaded, this._progress.bitrate = this._bitrateTimer.getBitrate(n, this._progress.loaded, i.bitrateInterval), i._progress.loaded = i.loaded = r, i._progress.bitrate = i.bitrate = i._bitrateTimer.getBitrate(n, r, i.bitrateInterval), this._trigger("progress", e.Event("progress", { delegatedEvent: t }), i), this._trigger("progressall", e.Event("progressall", { delegatedEvent: t }), this._progress) } }, _initProgressListener: function (t) { var i = this, r = t.xhr ? t.xhr() : e.ajaxSettings.xhr(); r.upload && (e(r.upload).bind("progress", function (e) { var r = e.originalEvent; e.lengthComputable = r.lengthComputable, e.loaded = r.loaded, e.total = r.total, i._onProgress(e, t) }), t.xhr = function () { return r }) }, _isInstanceOf: function (e, t) { return Object.prototype.toString.call(t) === "[object " + e + "]" }, _initXHRData: function (t) { var i, r = this, n = t.files[0], o = t.multipart || !e.support.xhrFileUpload, a = "array" === e.type(t.paramName) ? t.paramName[0] : t.paramName; t.headers = e.extend({}, t.headers), t.contentRange && (t.headers["Content-Range"] = t.contentRange), o && !t.blob && this._isInstanceOf("File", n) || (t.headers["Content-Disposition"] = 'attachment; filename="' + encodeURI(n.name) + '"'), o ? e.support.xhrFormDataFileUpload && (t.postMessage ? (i = this._getFormData(t), t.blob ? i.push({ name: a, value: t.blob }) : e.each(t.files, function (r, n) { i.push({ name: "array" === e.type(t.paramName) && t.paramName[r] || a, value: n }) })) : (r._isInstanceOf("FormData", t.formData) ? i = t.formData : (i = new FormData, e.each(this._getFormData(t), function (e, t) { i.append(t.name, t.value) })), t.blob ? i.append(a, t.blob, n.name) : e.each(t.files, function (n, o) { (r._isInstanceOf("File", o) || r._isInstanceOf("Blob", o)) && i.append("array" === e.type(t.paramName) && t.paramName[n] || a, o, o.uploadName || o.name) })), t.data = i) : (t.contentType = n.type || "application/octet-stream", t.data = t.blob || n), t.blob = null }, _initIframeSettings: function (t) { var i = e("<a></a>").prop("href", t.url).prop("host"); t.dataType = "iframe " + (t.dataType || ""), t.formData = this._getFormData(t), t.redirect && i && i !== location.host && t.formData.push({ name: t.redirectParamName || "redirect", value: t.redirect }) }, _initDataSettings: function (e) { this._isXHRUpload(e) ? (this._chunkedUpload(e, !0) || (e.data || this._initXHRData(e), this._initProgressListener(e)), e.postMessage && (e.dataType = "postmessage " + (e.dataType || ""))) : this._initIframeSettings(e) }, _getParamName: function (t) { var i = e(t.fileInput), r = t.paramName; return r ? e.isArray(r) || (r = [r]) : (r = [], i.each(function () { for (var t = e(this), i = t.prop("name") || "files[]", n = (t.prop("files") || [1]).length; n;)r.push(i), n -= 1 }), r.length || (r = [i.prop("name") || "files[]"])), r }, _initFormSettings: function (t) { t.form && t.form.length || (t.form = e(t.fileInput.prop("form")), t.form.length || (t.form = e(this.options.fileInput.prop("form")))), t.paramName = this._getParamName(t), t.url || (t.url = t.form.prop("action") || location.href), t.type = (t.type || "string" === e.type(t.form.prop("method")) && t.form.prop("method") || "").toUpperCase(), "POST" !== t.type && "PUT" !== t.type && "PATCH" !== t.type && (t.type = "POST"), t.formAcceptCharset || (t.formAcceptCharset = t.form.attr("accept-charset")) }, _getAJAXSettings: function (t) { var i = e.extend({}, this.options, t); return this._initFormSettings(i), this._initDataSettings(i), i }, _getDeferredState: function (e) { return e.state ? e.state() : e.isResolved() ? "resolved" : e.isRejected() ? "rejected" : "pending" }, _enhancePromise: function (e) { return e.success = e.done, e.error = e.fail, e.complete = e.always, e }, _getXHRPromise: function (t, i, r) { var n = e.Deferred(), o = n.promise(); return i = i || this.options.context || o, !0 === t ? n.resolveWith(i, r) : !1 === t && n.rejectWith(i, r), o.abort = n.promise, this._enhancePromise(o) }, _addConvenienceMethods: function (t, i) { var r = this, n = function (t) { return e.Deferred().resolveWith(r, t).promise() }; i.process = function (t, o) { return (t || o) && (i._processQueue = this._processQueue = (this._processQueue || n([this])).pipe(function () { return i.errorThrown ? e.Deferred().rejectWith(r, [i]).promise() : n(arguments) }).pipe(t, o)), this._processQueue || n([this]) }, i.submit = function () { return "pending" !== this.state() && (i.jqXHR = this.jqXHR = !1 !== r._trigger("submit", e.Event("submit", { delegatedEvent: t }), this) && r._onSend(t, this)), this.jqXHR || r._getXHRPromise() }, i.abort = function () { return this.jqXHR ? this.jqXHR.abort() : (this.errorThrown = "abort", r._trigger("fail", null, this), r._getXHRPromise(!1)) }, i.state = function () { return this.jqXHR ? r._getDeferredState(this.jqXHR) : this._processQueue ? r._getDeferredState(this._processQueue) : void 0 }, i.processing = function () { return !this.jqXHR && this._processQueue && "pending" === r._getDeferredState(this._processQueue) }, i.progress = function () { return this._progress }, i.response = function () { return this._response } }, _getUploadedBytes: function (e) { var t = e.getResponseHeader("Range"), i = t && t.split("-"), r = i && i.length > 1 && parseInt(i[1], 10); return r && r + 1 }, _chunkedUpload: function (t, i) { t.uploadedBytes = t.uploadedBytes || 0; var r, n, o = this, a = t.files[0], s = a.size, l = t.uploadedBytes, p = t.maxChunkSize || s, u = this._blobSlice, d = e.Deferred(), f = d.promise(); return !(!(this._isXHRUpload(t) && u && (l || p < s)) || t.data) && (!!i || (l >= s ? (a.error = t.i18n("uploadedBytes"), this._getXHRPromise(!1, t.context, [null, "error", a.error])) : (n = function () { var i = e.extend({}, t), f = i._progress.loaded; i.blob = u.call(a, l, l + p, a.type), i.chunkSize = i.blob.size, i.contentRange = "bytes " + l + "-" + (l + i.chunkSize - 1) + "/" + s, o._initXHRData(i), o._initProgressListener(i), r = (!1 !== o._trigger("chunksend", null, i) && e.ajax(i) || o._getXHRPromise(!1, i.context)).done(function (r, a, p) { l = o._getUploadedBytes(p) || l + i.chunkSize, f + i.chunkSize - i._progress.loaded && o._onProgress(e.Event("progress", { lengthComputable: !0, loaded: l - i.uploadedBytes, total: l - i.uploadedBytes }), i), t.uploadedBytes = i.uploadedBytes = l, i.result = r, i.textStatus = a, i.jqXHR = p, o._trigger("chunkdone", null, i), o._trigger("chunkalways", null, i), l < s ? n() : d.resolveWith(i.context, [r, a, p]) }).fail(function (e, t, r) { i.jqXHR = e, i.textStatus = t, i.errorThrown = r, o._trigger("chunkfail", null, i), o._trigger("chunkalways", null, i), d.rejectWith(i.context, [e, t, r]) }) }, this._enhancePromise(f), f.abort = function () { return r.abort() }, n(), f))) }, _beforeSend: function (e, t) { 0 === this._active && (this._trigger("start"), this._bitrateTimer = new this._BitrateTimer, this._progress.loaded = this._progress.total = 0, this._progress.bitrate = 0), this._initResponseObject(t), this._initProgressObject(t), t._progress.loaded = t.loaded = t.uploadedBytes || 0, t._progress.total = t.total = this._getTotal(t.files) || 1, t._progress.bitrate = t.bitrate = 0, this._active += 1, this._progress.loaded += t.loaded, this._progress.total += t.total }, _onDone: function (t, i, r, n) { var o = n._progress.total, a = n._response; n._progress.loaded < o && this._onProgress(e.Event("progress", { lengthComputable: !0, loaded: o, total: o }), n), a.result = n.result = t, a.textStatus = n.textStatus = i, a.jqXHR = n.jqXHR = r, this._trigger("done", null, n) }, _onFail: function (e, t, i, r) { var n = r._response; r.recalculateProgress && (this._progress.loaded -= r._progress.loaded, this._progress.total -= r._progress.total), n.jqXHR = r.jqXHR = e, n.textStatus = r.textStatus = t, n.errorThrown = r.errorThrown = i, this._trigger("fail", null, r) }, _onAlways: function (e, t, i, r) { this._trigger("always", null, r) }, _onSend: function (t, i) { i.submit || this._addConvenienceMethods(t, i); var r, n, o, a, s = this, l = s._getAJAXSettings(i), p = function () { return s._sending += 1, l._bitrateTimer = new s._BitrateTimer, r = r || ((n || !1 === s._trigger("send", e.Event("send", { delegatedEvent: t }), l)) && s._getXHRPromise(!1, l.context, n) || s._chunkedUpload(l) || e.ajax(l)).done(function (e, t, i) { s._onDone(e, t, i, l) }).fail(function (e, t, i) { s._onFail(e, t, i, l) }).always(function (e, t, i) { if (s._onAlways(e, t, i, l), s._sending -= 1, s._active -= 1, l.limitConcurrentUploads && l.limitConcurrentUploads > s._sending) for (var r = s._slots.shift(); r;) { if ("pending" === s._getDeferredState(r)) { r.resolve(); break } r = s._slots.shift() } 0 === s._active && s._trigger("stop") }) }; return this._beforeSend(t, l), this.options.sequentialUploads || this.options.limitConcurrentUploads && this.options.limitConcurrentUploads <= this._sending ? (this.options.limitConcurrentUploads > 1 ? (o = e.Deferred(), this._slots.push(o), a = o.pipe(p)) : (this._sequence = this._sequence.pipe(p, p), a = this._sequence), a.abort = function () { return n = [void 0, "abort", "abort"], r ? r.abort() : (o && o.rejectWith(l.context, n), p()) }, this._enhancePromise(a)) : p() }, _onAdd: function (t, i) { var r, n, o, a, s = this, l = !0, p = e.extend({}, this.options, i), u = i.files, d = u.length, f = p.limitMultiFileUploads, c = p.limitMultiFileUploadSize, h = p.limitMultiFileUploadSizeOverhead, g = 0, m = this._getParamName(p), _ = 0; if (!c || d && void 0 !== u[0].size || (c = void 0), (p.singleFileUploads || f || c) && this._isXHRUpload(p)) if (p.singleFileUploads || c || !f) if (!p.singleFileUploads && c) for (o = [], r = [], a = 0; a < d; a += 1)g += u[a].size + h, (a + 1 === d || g + u[a + 1].size + h > c || f && a + 1 - _ >= f) && (o.push(u.slice(_, a + 1)), (n = m.slice(_, a + 1)).length || (n = m), r.push(n), _ = a + 1, g = 0); else r = m; else for (o = [], r = [], a = 0; a < d; a += f)o.push(u.slice(a, a + f)), (n = m.slice(a, a + f)).length || (n = m), r.push(n); else o = [u], r = [m]; return i.originalFiles = u, e.each(o || u, function (n, a) { var p = e.extend({}, i); return p.files = o ? a : [a], p.paramName = r[n], s._initResponseObject(p), s._initProgressObject(p), s._addConvenienceMethods(t, p), l = s._trigger("add", e.Event("add", { delegatedEvent: t }), p) }), l }, _replaceFileInput: function (t) { var i = t.fileInput, r = i.clone(!0); t.fileInputClone = r, e("<form></form>").append(r)[0].reset(), i.after(r).detach(), e.cleanData(i.unbind("remove")), this.options.fileInput = this.options.fileInput.map(function (e, t) { return t === i[0] ? r[0] : t }), i[0] === this.element[0] && (this.element = r) }, _handleFileTreeEntry: function (t, i) { var r, n = this, o = e.Deferred(), a = function (e) { e && !e.entry && (e.entry = t), o.resolve([e]) }, s = function () { r.readEntries(function (e) { var r; e.length ? (l = l.concat(e), s()) : (r = l, n._handleFileTreeEntries(r, i + t.name + "/").done(function (e) { o.resolve(e) }).fail(a)) }, a) }, l = []; return i = i || "", t.isFile ? t._file ? (t._file.relativePath = i, o.resolve(t._file)) : t.file(function (e) { e.relativePath = i, o.resolve(e) }, a) : t.isDirectory ? (r = t.createReader(), s()) : o.resolve([]), o.promise() }, _handleFileTreeEntries: function (t, i) { var r = this; return e.when.apply(e, e.map(t, function (e) { return r._handleFileTreeEntry(e, i) })).pipe(function () { return Array.prototype.concat.apply([], arguments) }) }, _getDroppedFiles: function (t) { var i = (t = t || {}).items; return i && i.length && (i[0].webkitGetAsEntry || i[0].getAsEntry) ? this._handleFileTreeEntries(e.map(i, function (e) { var t; return e.webkitGetAsEntry ? ((t = e.webkitGetAsEntry()) && (t._file = e.getAsFile()), t) : e.getAsEntry() })) : e.Deferred().resolve(e.makeArray(t.files)).promise() }, _getSingleFileInputFiles: function (t) { var i, r, n = (t = e(t)).prop("webkitEntries") || t.prop("entries"); if (n && n.length) return this._handleFileTreeEntries(n); if ((i = e.makeArray(t.prop("files"))).length) void 0 === i[0].name && i[0].fileName && e.each(i, function (e, t) { t.name = t.fileName, t.size = t.fileSize }); else { if (!(r = t.prop("value"))) return e.Deferred().resolve([]).promise(); i = [{ name: r.replace(/^.*\\/, "") }] } return e.Deferred().resolve(i).promise() }, _getFileInputFiles: function (t) { return t instanceof e && 1 !== t.length ? e.when.apply(e, e.map(t, this._getSingleFileInputFiles)).pipe(function () { return Array.prototype.concat.apply([], arguments) }) : this._getSingleFileInputFiles(t) }, _onChange: function (t) { var i = this, r = { fileInput: e(t.target), form: e(t.target.form) }; this._getFileInputFiles(r.fileInput).always(function (n) { r.files = n, i.options.replaceFileInput && i._replaceFileInput(r), !1 !== i._trigger("change", e.Event("change", { delegatedEvent: t }), r) && i._onAdd(t, r) }) }, _onPaste: function (t) { var i = t.originalEvent && t.originalEvent.clipboardData && t.originalEvent.clipboardData.items, r = { files: [] }; i && i.length && (e.each(i, function (e, t) { var i = t.getAsFile && t.getAsFile(); i && r.files.push(i) }), !1 !== this._trigger("paste", e.Event("paste", { delegatedEvent: t }), r) && this._onAdd(t, r)) }, _onDrop: function (t) { t.dataTransfer = t.originalEvent && t.originalEvent.dataTransfer; var i = this, r = t.dataTransfer, n = {}; r && r.files && r.files.length && (t.preventDefault(), this._getDroppedFiles(r).always(function (r) { n.files = r, !1 !== i._trigger("drop", e.Event("drop", { delegatedEvent: t }), n) && i._onAdd(t, n) })) }, _onDragOver: t("dragover"), _onDragEnter: t("dragenter"), _onDragLeave: t("dragleave"), _initEventHandlers: function () { this._isXHRUpload(this.options) && (this._on(this.options.dropZone, { dragover: this._onDragOver, drop: this._onDrop, dragenter: this._onDragEnter, dragleave: this._onDragLeave }), this._on(this.options.pasteZone, { paste: this._onPaste })), e.support.fileInput && this._on(this.options.fileInput, { change: this._onChange }) }, _destroyEventHandlers: function () { this._off(this.options.dropZone, "dragenter dragleave dragover drop"), this._off(this.options.pasteZone, "paste"), this._off(this.options.fileInput, "change") }, _setOption: function (t, i) { var r = -1 !== e.inArray(t, this._specialOptions); r && this._destroyEventHandlers(), this._super(t, i), r && (this._initSpecialOptions(), this._initEventHandlers()) }, _initSpecialOptions: function () { var t = this.options; void 0 === t.fileInput ? t.fileInput = this.element.is('input[type="file"]') ? this.element : this.element.find('input[type="file"]') : t.fileInput instanceof e || (t.fileInput = e(t.fileInput)), t.dropZone instanceof e || (t.dropZone = e(t.dropZone)), t.pasteZone instanceof e || (t.pasteZone = e(t.pasteZone)) }, _getRegExp: function (e) { var t = e.split("/"), i = t.pop(); return t.shift(), new RegExp(t.join("/"), i) }, _isRegExpOption: function (t, i) { return "url" !== t && "string" === e.type(i) && /^\/.*\/[igm]{0,3}$/.test(i) }, _initDataAttributes: function () { var t = this, i = this.options, r = e(this.element[0].cloneNode(!1)); e.each(r.data(), function (e, n) { var o = "data-" + e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(); r.attr(o) && (t._isRegExpOption(e, n) && (n = t._getRegExp(n)), i[e] = n) }) }, _create: function () { this._initDataAttributes(), this._initSpecialOptions(), this._slots = [], this._sequence = this._getXHRPromise(!0), this._sending = this._active = 0, this._initProgressObject(this), this._initEventHandlers() }, active: function () { return this._active }, progress: function () { return this._progress }, add: function (t) { var i = this; t && !this.options.disabled && (t.fileInput && !t.files ? this._getFileInputFiles(t.fileInput).always(function (e) { t.files = e, i._onAdd(null, t) }) : (t.files = e.makeArray(t.files), this._onAdd(null, t))) }, send: function (t) { if (t && !this.options.disabled) { if (t.fileInput && !t.files) { var i, r, n = this, o = e.Deferred(), a = o.promise(); return a.abort = function () { return r = !0, i ? i.abort() : (o.reject(null, "abort", "abort"), a) }, this._getFileInputFiles(t.fileInput).always(function (e) { r || (e.length ? (t.files = e, (i = n._onSend(null, t)).then(function (e, t, i) { o.resolve(e, t, i) }, function (e, t, i) { o.reject(e, t, i) })) : o.reject()) }), this._enhancePromise(a) } if (t.files = e.makeArray(t.files), t.files.length) return this._onSend(null, t) } return this._getXHRPromise(!1, t && t.context) } }) }), function (e) { "use strict"; "function" == typeof define && define.amd ? define(["jquery"], e) : e(window.jQuery) }(function (e) { "use strict"; var t = 0; e.ajaxTransport("iframe", function (i) { if (i.async) { var r, n, o, a = i.initialIframeSrc || "javascript:false;"; return { send: function (s, l) { (r = e('<form style="display:none;"></form>')).attr("accept-charset", i.formAcceptCharset), o = /\?/.test(i.url) ? "&" : "?", "DELETE" === i.type ? (i.url = i.url + o + "_method=DELETE", i.type = "POST") : "PUT" === i.type ? (i.url = i.url + o + "_method=PUT", i.type = "POST") : "PATCH" === i.type && (i.url = i.url + o + "_method=PATCH", i.type = "POST"), n = e('<iframe src="' + a + '" name="iframe-transport-' + (t += 1) + '"></iframe>').bind("load", function () { var t, o = e.isArray(i.paramName) ? i.paramName : [i.paramName]; n.unbind("load").bind("load", function () { var t; try { if (!(t = n.contents()).length || !t[0].firstChild) throw new Error } catch (e) { t = void 0 } l(200, "success", { iframe: t }), e('<iframe src="' + a + '"></iframe>').appendTo(r), window.setTimeout(function () { r.remove() }, 0) }), r.prop("target", n.prop("name")).prop("action", i.url).prop("method", i.type), i.formData && e.each(i.formData, function (t, i) { e('<input type="hidden"/>').prop("name", i.name).val(i.value).appendTo(r) }), i.fileInput && i.fileInput.length && "POST" === i.type && (t = i.fileInput.clone(), i.fileInput.after(function (e) { return t[e] }), i.paramName && i.fileInput.each(function (t) { e(this).prop("name", o[t] || i.paramName) }), r.append(i.fileInput).prop("enctype", "multipart/form-data").prop("encoding", "multipart/form-data"), i.fileInput.removeAttr("form")), r.submit(), t && t.length && i.fileInput.each(function (i, r) { var n = e(t[i]); e(r).prop("name", n.prop("name")).attr("form", n.attr("form")), n.replaceWith(r) }) }), r.append(n).appendTo(document.body) }, abort: function () { n && n.unbind("load").prop("src", a), r && r.remove() } } } }), e.ajaxSetup({ converters: { "iframe text": function (t) { return t && e(t[0].body).text() }, "iframe json": function (t) { return t && e.parseJSON(e(t[0].body).text()) }, "iframe html": function (t) { return t && e(t[0].body).html() }, "iframe xml": function (t) { var i = t && t[0]; return i && e.isXMLDoc(i) ? i : e.parseXML(i.XMLDocument && i.XMLDocument.xml || e(i.body).html()) }, "iframe script": function (t) { return t && e.globalEval(e(t[0].body).text()) } } }) });


function cargarPixUpload(token, urlCarga) {
    'use strict';
    $(".pix-upload").each(function () {
        var pixUpload = $(this);

        var labelSinArchivoSeleccionado = 'Ningún archivo seleccionado';
        if (pixUpload.attr('data-texto-sin-archivo-seleccionado') != undefined && pixUpload.attr('data-texto-sin-archivo-seleccionado') != '') {
            labelSinArchivoSeleccionado = pixUpload.attr('data-texto-sin-archivo-seleccionado')
        }

        if (!pixUpload.hasClass("cargado")) {
            pixUpload.removeClass("imgCargada");
            pixUpload.find("label").remove();

            var fichero = $(this).find("input[type=hidden]").val();
            var fup = $(this).find("input[type=file]");
            var label = $("<label>");
            if (fichero == '') {
                fichero = labelSinArchivoSeleccionado;
                label.html(fichero);
                $(this).append(label);
            } else {
                $(this).append(label);
                cargarFichero(pixUpload, fichero);
            }
            fup.attr("title", fichero);

            var url = '/pix-admin/pix-sistema/pix-sistema.ashx?funcion=cargar-fichero';
            if (urlCarga != undefined) {
                url = urlCarga;
            }
            if (token != undefined && token != '') {

                if (url.lastIndexOf('?') > 0) {
                    url += '&';
                } else {
                    url += '?';
                }
                url += 'token=' + token;
            }


            fup.fileupload({
                'url': url,
                dataType: 'json',
                pasteZone: null,
                start: function () {
                    var divProgreso = $("<div>", { 'class': 'divProgreso', 'style': 'display:none' });
                    pixUpload.append(divProgreso);
                    pixUpload.find(".btnImg").slideUp(200, function () { $(this).remove(); });
                    divProgreso.fadeIn(200);
                },
                fail: function (e, data) {
                    console.warn(e, data);
                    mostrarSnackbar('No ha sido posible cargar el archivo seleccionado.');
                    var pixUpload = $(this).parent();
                    var divProgreso = pixUpload.find(".divProgreso");
                    divProgreso.delay(400).fadeOut(200, function () { $(this).remove(); });
                },
                done: function (e, data) {

                    if (data != undefined && data.result != undefined && data.result.files != undefined && data.result.files.length > 0) {
                        var hdd = pixUpload.find('input[type="hidden"]');
                        hdd.removeAttr('data-url-base-imagenes');
                        cargarFichero($(this).parent(), data.result.files[0].url);
                    } else {
                        mostrarSnackbar('No ha sido posible cargar el archivo seleccionado.');
                    }
                },
                progressall: function (e, data) {
                    var progreso = parseInt(data.loaded / data.total * 100, 10);
                    var divProgreso = $(this).parent().find(".divProgreso");
                    divProgreso.css('width', progreso + '%').html(progreso + '%');
                }
            }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
            pixUpload.addClass("cargado");
        }
    });
}


function bindPixUploadExcel() {
    $('.pix-upload-excel').each(function () {

        var pixUploadExcel = $(this);
        textoBoton = 'Cargar fichero Excel';

        if (pixUploadExcel.find('.pix-btn').length == 0) {

            if (pixUploadExcel.attr('data-texto-boton') != undefined && pixUploadExcel.attr('data-texto-boton') != '') {
                textoBoton = pixUploadExcel.attr('data-texto-boton');
            }

            pixUploadExcel.append($('<a>', { 'class': 'pix-btn pix-btn-verde' }).append($('<i>', { 'class': 'fas fa-file-excel' })).append(textoBoton));
        }

        if (pixUploadExcel.find('input[type="file"]').length == 0) {
            pixUploadExcel.append($('<input>', { 'type': 'file', 'accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'title': textoBoton }));
        }

        var urlDestino = '/funciones.ashx?funcion=cargar-fichero-excel';
        if (pixUploadExcel.attr('data-url-destino') != undefined && pixUploadExcel.attr('data-url-destino') != '') {
            urlDestino = pixUploadExcel.attr('data-url-destino');
        }

        pixUploadExcel.find('input').fileupload({
            'url': urlDestino,
            dataType: 'json',
            pasteZone: null,
            start: function () {
                var divProgreso = $("<div>", { 'class': 'divProgreso', 'style': 'display:none' });
                pixUploadExcel.append(divProgreso);
                divProgreso.fadeIn(200);
            },
            fail: function (e, data) {
                console.warn(e, data);
                mostrarSnackbar('No ha sido posible cargar el fichero Excel seleccionado.');
                pixUploadExcel.find(".divProgreso").delay(400).fadeOut(200, function () { $(this).remove(); });
            },
            done: function (e, data) {
                pixUploadExcel.find('.divProgreso').delay(400).fadeOut(200, function () { $(this).remove(); });

                if (data.result.VALOR == 1) {

                    if (pixUploadExcel.attr('data-recargar-listado') != undefined && pixUploadExcel.attr('data-recargar-listado').toLowerCase() == 'true') {
                        if ($('.pix-btn-filtros-busqueda').length > 0) {
                            $('.pix-btn-filtros-busqueda').trigger('click');
                        } else {
                            window.location.reload();
                        }
                    }

                    if (pixUploadExcel.attr('data-url-redireccion') != undefined) {
                        window.location = pixUploadExcel.attr('data-url-redireccion');
                    } else {
                        mostrarSnackbar(data.result.TEXTO);
                    }

                } else {
                    mostrarSnackbar('No ha sido posible cargar el fichero Excel seleccionado.', 'div-snackbar-rojo');
                }
            },
            progressall: function (e, data) {
                var progreso = parseInt(data.loaded / data.total * 100, 10);
                if (progreso == 100) {
                    //Cambio el porcentaje de progreso a 99, para que de tiempo a procesar la Excel
                    progreso = 99;
                }
                pixUploadExcel.find(".divProgreso").css('width', progreso + '%').html(progreso + '%');

            }
        }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
    });
}

function bindPixUploadGenericos() {
    $('.pix-upload-generico').each(function () {

        var pixUploadGenerico = $(this);
        textoBoton = 'Cargar fichero ';

        if (pixUploadGenerico.find('.pix-btn').length == 0) {

            if (pixUploadGenerico.attr('data-texto-boton') != undefined && pixUploadGenerico.attr('data-texto-boton') != '') {
                textoBoton = pixUploadGenerico.attr('data-texto-boton');
            }

            var icono = 'fas fa-file-import';

            if (pixUploadGenerico.attr('data-icono') != undefined && pixUploadGenerico.attr('data-icono') != '')
                icono = pixUploadGenerico.attr('data-icono')

            pixUploadGenerico.append($('<a>', { 'class': 'pix-btn pix-btn-verde' }).append($('<i>', { 'class': icono })).append(textoBoton));
        }

        if (pixUploadGenerico.find('input[type="file"]').length == 0) {

            var accept = "*"

            if (pixUploadGenerico.attr('data-accept') != undefined && pixUploadGenerico.attr('data-accept') != '')
                accept = pixUploadGenerico.attr('data-accept');


            pixUploadGenerico.append($('<input>', { 'type': 'file', 'accept': accept, 'title': textoBoton }));
        }

        var urlDestino = '/funciones.ashx?funcion=cargar-fichero-generico';
        if (pixUploadGenerico.attr('data-url-destino') != undefined && pixUploadGenerico.attr('data-url-destino') != '') {
            urlDestino = pixUploadGenerico.attr('data-url-destino');
        }

        pixUploadGenerico.find('input').fileupload({
            'url': urlDestino,
            dataType: 'json',
            pasteZone: null,
            start: function () {
                var divProgreso = $("<div>", { 'class': 'divProgreso', 'style': 'display:none' });
                pixUploadGenerico.append(divProgreso);
                divProgreso.fadeIn(200);
            },
            fail: function (e, data) {
                console.warn(e, data);
                mostrarSnackbar('No ha sido posible cargar el fichero seleccionado.');
                pixUploadGenerico.find(".divProgreso").delay(400).fadeOut(200, function () { $(this).remove(); });
            },
            done: function (e, data) {
                pixUploadGenerico.find('.divProgreso').delay(400).fadeOut(200, function () { $(this).remove(); });

                if (pixUploadGenerico.attr('data-funcion-callback') != undefined && pixUploadGenerico.attr('data-funcion-callback') != '') {

                    eval(pixUploadGenerico.attr('data-funcion-callback'));

                } else {
                    if (data.result.VALOR == 1) {
                        mostrarSnackbar(data.result.TEXTO);

                        if (pixUploadGenerico.attr('data-recargar-listado') != undefined && pixUploadGenerico.attr('data-recargar-listado').toLowerCase() == 'true') {
                            if ($('.pix-btn-filtros-busqueda').length > 0) {
                                $('.pix-btn-filtros-busqueda').trigger('click');
                            } else {
                                window.location.reload();
                            }
                        }
                    } else {
                        mostrarSnackbar('No ha sido posible cargar el fichero seleccionado.', 'div-snackbar-rojo');
                    }
                }

                
            },
            progressall: function (e, data) {
                var progreso = parseInt(data.loaded / data.total * 100, 10);
                if (progreso == 100) {
                    //Cambio el porcentaje de progreso a 99, para que de tiempo a procesar el fichero
                    progreso = 99;
                }
                pixUploadGenerico.find(".divProgreso").css('width', progreso + '%').html(progreso + '%');

            }
        }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
    });
}

function bindPixUploadFotoPerfil() {
    $('.pix-upload-foto-perfil').each(function () {

        var pixUploadFotoPerfil = $(this);
        var textoBoton = 'Cambiar mi foto';
        var urlFotoInicial = '//cdn.pixelinnova.com/pixelone/sin-usuario.svg'
        var ancho = 110;
        var alto = 110;

        if (pixUploadFotoPerfil.attr('data-redimensionar-ancho') != undefined && pixUploadFotoPerfil.attr('data-redimensionar-ancho') != '') {
            ancho = pixUploadFotoPerfil.attr('data-redimensionar-ancho');
        }

        if (pixUploadFotoPerfil.attr('data-redimensionar-alto') != undefined && pixUploadFotoPerfil.attr('data-redimensionar-alto') != '') {
            alto = pixUploadFotoPerfil.attr('data-redimensionar-alto');
        }
        if (pixUploadFotoPerfil.find('a').length == 0) {

            if (pixUploadFotoPerfil.attr('data-texto-boton') != undefined && pixUploadFotoPerfil.attr('data-texto-boton') != '') {
                textoBoton = pixUploadFotoPerfil.attr('data-texto-boton');
            }
            if (pixUploadFotoPerfil.attr('data-url-foto-inicial') != undefined && pixUploadFotoPerfil.attr('data-url-foto-inicial') != '') {
                urlFotoInicial = pixUploadFotoPerfil.attr('data-url-foto-inicial');
            }

            pixUploadFotoPerfil.append($('<a>', { 'class': 'pix-foto-perfil' }).append($('<img>', { 'src': urlFotoInicial, 'width':ancho,'height':alto })));
        }

        if (pixUploadFotoPerfil.find('input[type="file"]').length == 0) {
            pixUploadFotoPerfil.append($('<input>', { 'type': 'file', 'accept': 'image/png, image/gif, image/jpeg, image/webp', 'title': textoBoton }));
        }

        var urlDestino = '/funciones.ashx?funcion=cargar-foto-perfil';
        if (pixUploadFotoPerfil.attr('data-url-destino') != undefined && pixUploadFotoPerfil.attr('data-url-destino') != '') {
            urlDestino = pixUploadFotoPerfil.attr('data-url-destino');
        }

        pixUploadFotoPerfil.find('input').fileupload({
            'url': urlDestino,
            dataType: 'json',
            pasteZone: null,
            start: function () {
                var divProgreso = $("<div>", { 'class': 'divProgreso', 'style': 'display:none' });
                pixUploadFotoPerfil.append(divProgreso);
                divProgreso.fadeIn(200);
            },
            fail: function (e, data) {
                console.warn(e, data);
                mostrarSnackbar('No ha sido posible cargar la foto seleccionada.','div-snackbar-rojo');
                pixUploadFotoPerfil.find(".divProgreso").delay(400).fadeOut(200, function () { $(this).remove(); });
            },
            done: function (e, data) {
                pixUploadFotoPerfil.find('.divProgreso').delay(400).fadeOut(200, function () { $(this).remove(); });



                if (data.result.VALOR == 1) {
                    pixUploadFotoPerfil.find('img').attr('src', data.result.TEXTO + '?w=' + ancho + '&h=' + alto + '&mode=crop&autorotate=1');

                } else {
                    mostrarSnackbar('No ha sido posible cargar la foto seleccionada.');
                }
            },
            progressall: function (e, data) {
                var progreso = parseInt(data.loaded / data.total * 100, 10);
                if (progreso == 100) {
                    //Cambio el porcentaje de progreso a 99, para que de tiempo a procesar la Excel
                    progreso = 99;
                }
                pixUploadFotoPerfil.find(".divProgreso").css('width', progreso + '%').html('<span>' + progreso + '%</span>');

            }
        }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
    });
}


function cargarFichero(pixUpload, fichero) {

    var divProgreso = pixUpload.find(".divProgreso");
    var fup = pixUpload.find("input[type=file]");
    var label = pixUpload.find("label");
    var hdd = pixUpload.find('input[type="hidden"]');
    pixUpload.find(".btnEliminar").remove();

    var btnEliminar = $("<a>", { 'class': 'btnEliminar', 'title': 'Eliminar' });

    hdd.val(fichero);
    if (fup.attr("accept") != undefined && (fup.attr("accept").includes("image/*") || fup.attr("accept").includes("image/svg+xml"))) {

        var urlBaseImagenes = '';
        if (hdd.attr('data-url-base-imagenes') != undefined && hdd.attr('data-url-base-imagenes') != '') {
            urlBaseImagenes = hdd.attr('data-url-base-imagenes');
            while (urlBaseImagenes.endsWith('/')) {
                urlBaseImagenes = urlBaseImagenes.substring(0, urlBaseImagenes.length - 1);
            }
            if (!fichero.startsWith('/')) {
                urlBaseImagenes += '/';
            }
        }
        var modoCorte = 'crop';
        if (hdd.attr('data-modo-corte-imageresizer') != undefined && hdd.attr('data-modo-corte-imageresizer') != '') {
            modoCorte = hdd.attr('data-modo-corte-imageresizer')
        }

        var modoEscala = "";
        if (hdd.attr('data-modo-escala-imageresizer') != undefined && hdd.attr('data-modo-escala-imageresizer') != '') {
            modoEscala = hdd.attr('data-modo-escala-imageresizer')
        }

        var btnImg = $("<a>", { "class": "btnImg", 'style': 'display:none', "href": urlBaseImagenes + fichero, 'target': '_blank' });

        var anchoImg = 200;
        var altoImg = 200;
        if (pixUpload.attr("data-ancho-img") != undefined) {
            btnImg.css({ 'width': pixUpload.attr("data-ancho-img") + 'px' });
            anchoImg = ''
            if (pixUpload.attr("data-ancho-img") * 1 > 0) {
                anchoImg = pixUpload.attr("data-ancho-img");
            }

        }
        if (pixUpload.attr("data-alto-img") != undefined) {
            btnImg.css({ 'height': pixUpload.attr("data-alto-img") + 'px' });
            altoImg = '';
            if (pixUpload.attr("data-alto-img") * 1 > 0) {
                altoImg = pixUpload.attr("data-alto-img");
            }
        }

        if (pixUpload.hasClass("no-encontrado")) {
            btnImg.append($("<img>", { 'src': urlBaseImagenes + '/pix-admin/img/sin-imagen.svg' }));
        } else {
            var urlFichero = fichero;
            if (!urlFichero.toLowerCase().startsWith('http')) {
                urlFichero = urlBaseImagenes + urlFichero;
            }
            btnImg.append($("<img>", { 'src': urlFichero + '?w=' + anchoImg + '&h=' + altoImg + '&mode=' + modoCorte + '&autorotate=1' + "&scale=" + modoEscala }));
        }
        btnEliminar.addClass("btnEliminarImg");

        if (hdd.attr('data-readonly') != 'true') {
            btnImg.append(btnEliminar);

        }


        pixUpload.prepend(btnImg);
        pixUpload.addClass("imgCargada");

    } else {
        pixUpload.addClass("ficheroCargado");
        pixUpload.append(btnEliminar);
    }

    if (divProgreso.length > 0) {

        divProgreso.delay(400).fadeOut(200, function () {
            $(this).remove();
            pixUpload.find(".btnImg").slideDown(300);
        });
    } else {
        pixUpload.find(".btnImg").show();
    }
    if (fichero != undefined) {
        label.html(fichero.replace(/^.*?([^\\\/]*)$/, '$1'));
        label.attr('title', 'Abrir ' + label.html());
        label.click(function (e) {
            e.stopPropagation();
            e.preventDefault();
            window.open(fichero);
        });
        $(this).attr("title", fichero.replace(/^.*?([^\\\/]*)$/, '$1'));
    }


    btnEliminar.click(function (e) {
        e.preventDefault();
        var pixUpload = $(this).parent();
        if ($(this).hasClass("btnEliminarImg")) {
            pixUpload = $(this).parent().parent();
        }

        var labelSinArchivoSeleccionado = 'Ningún archivo seleccionado';
        if (pixUpload.attr('data-texto-sin-archivo-seleccionado') != undefined && pixUpload.attr('data-texto-sin-archivo-seleccionado') != '') {
            labelSinArchivoSeleccionado = pixUpload.attr('data-texto-sin-archivo-seleccionado');
        }

        pixUpload.find(".btnImg").slideUp(200, function () { $(this).remove(); pixUpload.removeClass("imgCargada"); });
        pixUpload.find("input[type=hidden]").val('');
        pixUpload.find("input[type=file]").attr('title', labelSinArchivoSeleccionado);
        pixUpload.find("label").html(labelSinArchivoSeleccionado);
        pixUpload.removeClass("ficheroCargado");
        $(this).remove();
    });

}

function parsearRespuestaGoogleOneTap(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


var timeoutSnackbar;
function mostrarSnackbar(mensaje, claseAdicional) {

    if (timeoutSnackbar != undefined) {
        clearTimeout(timeoutSnackbar);
    }
    $('.div-snackbar').remove();
    var divSnackbar = $('<div>', { 'class': 'div-snackbar' });
    if (claseAdicional != undefined) {
        divSnackbar.addClass(claseAdicional);
    }
    divSnackbar.append($('<div>').append($('<div>').append(mensaje)).append($('<div>').append($('<a>', { 'href': '#', 'class': 'btn-aceptar-snackbar' }).html('ACEPTAR'))));
    divSnackbar.appendTo("body");
    timeoutSnackbar = setTimeout(function () { $('.div-snackbar').find('div').fadeOut(200, function () { $('.div-snackbar').remove(); }); }, 4000);
    $('.btn-aceptar-snackbar').unbind('click').click(function (e) { e.preventDefault(); $('.div-snackbar').find('div').fadeOut(200, function () { $('.div-snackbar').remove(); }); });
}


function mostrarTooltip(evento, texto) {
  
    //Si el texto inicial cambia, tiene que recalcular la anchura, por lo que eliminamos el  tooltip para volverlo a crear
    if (texto != $(".pix-tooltip").html()) {
        $(".pix-tooltip").remove();
    }
    //Si el texto del tooltip no está vacío
    if (undefined != texto && texto != '') {
        //Si el tooltip aún no existe, lo creamos.
        if ($(".pix-tooltip").length == 0) {
            $("body").append($("<div>", { 'class': 'pix-tooltip' }));
            texto = texto.replace(/(?:\r\n|\r|\n)/g, '<br/>');
            $(".pix-tooltip").html(texto).css({ 'left': 0, 'top': 0, 'opacity': '0.5', 'animation': 'none' });
            //Calculamos la anchura que debe tener
            $(".pix-tooltip").css('width', $(".pix-tooltip").width() + 24);
        }
        texto = texto.replace(/(?:\r\n|\r|\n)/g, '<br/>');
        $(".pix-tooltip").css({ 'opacity': '1','left':'','right':'','top':'' });
        if (evento.pageX + $(".pix-tooltip").width() + 48 > $(window).width()) {
            $(".pix-tooltip").css({ 'right': $(window).width() - evento.pageX + 12 });
        } else {
            $(".pix-tooltip").css({ 'left': evento.pageX + 6 + 'px' });

        }
        if (evento.pageY + $(".pix-tooltip").height() + 48 > $(window).scrollTop() + $(window).height()) {
            $(".pix-tooltip").css({ 'top': evento.pageY + - $(".pix-tooltip").height() - 32 });
        } else {
            $(".pix-tooltip").css({ 'top': evento.pageY + 12 + 'px' });
        }
    } else {
        //Si el tooltip existe pero el texto viene vacío, lo eliminamos
        if ($(".pix-tooltip").length != 0) {
            $(".pix-tooltip").remove();
        }
    }
}

$(document).ajaxComplete(function () { inicializarPixTooltip() });


function inicializarPixTooltip() {
    $("[data-pix-tooltip]").unbind('mousemove').mousemove(function (e) { mostrarTooltip(e, $(this).attr('data-pix-tooltip')); });
    $("[data-pix-tooltip]").not('[data-ignorar-mouseleave]').unbind('mouseleave').mouseleave(function (e) { mostrarTooltip(e, ''); });
    $("[data-pix-tooltip]").click(function (e) { mostrarTooltip(e, ''); });

}

function inicializarPixAcordeon() {

    $(".pix-acordeon > div > label").unbind('click').click(function (e) {
        e.preventDefault();

        if ($(this).closest('.pix-acordeon').attr('data-permitir-varios-activos') != undefined &&
            $(this).closest('.pix-acordeon').attr('data-permitir-varios-activos') != 'true') {

            if (!$(this).parent().hasClass('activo')) {

                $(this).parent().addClass('actual');
                $(this).closest('.pix-acordeon').find('div.activo:not(.actual) div').first().slideUp(100);
                $(this).closest('.pix-acordeon').find('div.activo').not('.actual').removeClass('activo');
                $(this).parent().removeClass('actual');

            }

        }

        $(this).parent().children('div').first().slideToggle(100, function () {
            $(this).parent().toggleClass('activo');

        });
    });
}

function registrarDispositivoMovil(deviceToken) {

    $.ajax({
        type: "POST",
        url: '/funciones.ashx',
        data: {
            'funcion': 'registrarDispositivoMovil',
            'deviceToken': deviceToken,
        },
        success: function (resultado) {
            //mostrarSnackbar(resultado.TEXTO);
        },
        error: function (resultado) {
            console.error(resultado);
        }
    });

}

var topLevelDomainList = [
    "AARP",
    "ABARTH",
    "ABB",
    "ABBOTT",
    "ABBVIE",
    "ABC",
    "ABLE",
    "ABOGADO",
    "ABUDHABI",
    "AC",
    "ACADEMY",
    "ACCENTURE",
    "ACCOUNTANT",
    "ACCOUNTANTS",
    "ACO",
    "ACTOR",
    "AD",
    "ADAC",
    "ADS",
    "ADULT",
    "AE",
    "AEG",
    "AERO",
    "AETNA",
    "AF",
    "AFAMILYCOMPANY",
    "AFL",
    "AFRICA",
    "AG",
    "AGAKHAN",
    "AGENCY",
    "AI",
    "AIG",
    "AIRBUS",
    "AIRFORCE",
    "AIRTEL",
    "AKDN",
    "AL",
    "ALFAROMEO",
    "ALIBABA",
    "ALIPAY",
    "ALLFINANZ",
    "ALLSTATE",
    "ALLY",
    "ALSACE",
    "ALSTOM",
    "AM",
    "AMAZON",
    "AMERICANEXPRESS",
    "AMERICANFAMILY",
    "AMEX",
    "AMFAM",
    "AMICA",
    "AMSTERDAM",
    "ANALYTICS",
    "ANDROID",
    "ANQUAN",
    "ANZ",
    "AO",
    "AOL",
    "APARTMENTS",
    "APP",
    "APPLE",
    "AQ",
    "AQUARELLE",
    "AR",
    "ARAB",
    "ARAMCO",
    "ARCHI",
    "ARMY",
    "ARPA",
    "ART",
    "ARTE",
    "AS",
    "ASDA",
    "ASIA",
    "ASSOCIATES",
    "AT",
    "ATHLETA",
    "ATTORNEY",
    "AU",
    "AUCTION",
    "AUDI",
    "AUDIBLE",
    "AUDIO",
    "AUSPOST",
    "AUTHOR",
    "AUTO",
    "AUTOS",
    "AVIANCA",
    "AW",
    "AWS",
    "AX",
    "AXA",
    "AZ",
    "AZURE",
    "BA",
    "BABY",
    "BAIDU",
    "BANAMEX",
    "BANANAREPUBLIC",
    "BAND",
    "BANK",
    "BAR",
    "BARCELONA",
    "BARCLAYCARD",
    "BARCLAYS",
    "BAREFOOT",
    "BARGAINS",
    "BASEBALL",
    "BASKETBALL",
    "BAUHAUS",
    "BAYERN",
    "BB",
    "BBC",
    "BBT",
    "BBVA",
    "BCG",
    "BCN",
    "BD",
    "BE",
    "BEATS",
    "BEAUTY",
    "BEER",
    "BENTLEY",
    "BERLIN",
    "BEST",
    "BESTBUY",
    "BET",
    "BF",
    "BG",
    "BH",
    "BHARTI",
    "BI",
    "BIBLE",
    "BID",
    "BIKE",
    "BING",
    "BINGO",
    "BIO",
    "BIZ",
    "BJ",
    "BLACK",
    "BLACKFRIDAY",
    "BLOCKBUSTER",
    "BLOG",
    "BLOOMBERG",
    "BLUE",
    "BM",
    "BMS",
    "BMW",
    "BN",
    "BNPPARIBAS",
    "BO",
    "BOATS",
    "BOEHRINGER",
    "BOFA",
    "BOM",
    "BOND",
    "BOO",
    "BOOK",
    "BOOKING",
    "BOSCH",
    "BOSTIK",
    "BOSTON",
    "BOT",
    "BOUTIQUE",
    "BOX",
    "BR",
    "BRADESCO",
    "BRIDGESTONE",
    "BROADWAY",
    "BROKER",
    "BROTHER",
    "BRUSSELS",
    "BS",
    "BT",
    "BUDAPEST",
    "BUGATTI",
    "BUILD",
    "BUILDERS",
    "BUSINESS",
    "BUY",
    "BUZZ",
    "BV",
    "BW",
    "BY",
    "BZ",
    "BZH",
    "CA",
    "CAB",
    "CAFE",
    "CAL",
    "CALL",
    "CALVINKLEIN",
    "CAM",
    "CAMERA",
    "CAMP",
    "CANCERRESEARCH",
    "CANON",
    "CAPETOWN",
    "CAPITAL",
    "CAPITALONE",
    "CAR",
    "CARAVAN",
    "CARDS",
    "CARE",
    "CAREER",
    "CAREERS",
    "CARS",
    "CASA",
    "CASE",
    "CASH",
    "CASINO",
    "CAT",
    "CATERING",
    "CATHOLIC",
    "CBA",
    "CBN",
    "CBRE",
    "CBS",
    "CC",
    "CD",
    "CENTER",
    "CEO",
    "CERN",
    "CF",
    "CFA",
    "CFD",
    "CG",
    "CH",
    "CHANEL",
    "CHANNEL",
    "CHARITY",
    "CHASE",
    "CHAT",
    "CHEAP",
    "CHINTAI",
    "CHRISTMAS",
    "CHROME",
    "CHURCH",
    "CI",
    "CIPRIANI",
    "CIRCLE",
    "CISCO",
    "CITADEL",
    "CITI",
    "CITIC",
    "CITY",
    "CITYEATS",
    "CK",
    "CL",
    "CLAIMS",
    "CLEANING",
    "CLICK",
    "CLINIC",
    "CLINIQUE",
    "CLOTHING",
    "CLOUD",
    "CLUB",
    "CLUBMED",
    "CM",
    "CN",
    "CO",
    "COACH",
    "CODES",
    "COFFEE",
    "COLLEGE",
    "COLOGNE",
    "COM",
    "COMCAST",
    "COMMBANK",
    "COMMUNITY",
    "COMPANY",
    "COMPARE",
    "COMPUTER",
    "COMSEC",
    "CONDOS",
    "CONSTRUCTION",
    "CONSULTING",
    "CONTACT",
    "CONTRACTORS",
    "COOKING",
    "COOKINGCHANNEL",
    "COOL",
    "COOP",
    "CORSICA",
    "COUNTRY",
    "COUPON",
    "COUPONS",
    "COURSES",
    "CPA",
    "CR",
    "CREDIT",
    "CREDITCARD",
    "CREDITUNION",
    "CRICKET",
    "CROWN",
    "CRS",
    "CRUISE",
    "CRUISES",
    "CSC",
    "CU",
    "CUISINELLA",
    "CV",
    "CW",
    "CX",
    "CY",
    "CYMRU",
    "CYOU",
    "CZ",
    "DABUR",
    "DAD",
    "DANCE",
    "DATA",
    "DATE",
    "DATING",
    "DATSUN",
    "DAY",
    "DCLK",
    "DDS",
    "DE",
    "DEAL",
    "DEALER",
    "DEALS",
    "DEGREE",
    "DELIVERY",
    "DELL",
    "DELOITTE",
    "DELTA",
    "DEMOCRAT",
    "DENTAL",
    "DENTIST",
    "DESI",
    "DESIGN",
    "DEV",
    "DHL",
    "DIAMONDS",
    "DIET",
    "DIGITAL",
    "DIRECT",
    "DIRECTORY",
    "DISCOUNT",
    "DISCOVER",
    "DISH",
    "DIY",
    "DJ",
    "DK",
    "DM",
    "DNP",
    "DO",
    "DOCS",
    "DOCTOR",
    "DOG",
    "DOMAINS",
    "DOT",
    "DOWNLOAD",
    "DRIVE",
    "DTV",
    "DUBAI",
    "DUCK",
    "DUNLOP",
    "DUPONT",
    "DURBAN",
    "DVAG",
    "DVR",
    "DZ",
    "EARTH",
    "EAT",
    "EC",
    "ECO",
    "EDEKA",
    "EDU",
    "EDUCATION",
    "EE",
    "EG",
    "EMAIL",
    "EMERCK",
    "ENERGY",
    "ENGINEER",
    "ENGINEERING",
    "ENTERPRISES",
    "EPSON",
    "EQUIPMENT",
    "ER",
    "ERICSSON",
    "ERNI",
    "ES",
    "ESQ",
    "ESTATE",
    "ET",
    "ETISALAT",
    "EU",
    "EUROVISION",
    "EUS",
    "EVENTS",
    "EXCHANGE",
    "EXPERT",
    "EXPOSED",
    "EXPRESS",
    "EXTRASPACE",
    "FAGE",
    "FAIL",
    "FAIRWINDS",
    "FAITH",
    "FAMILY",
    "FAN",
    "FANS",
    "FARM",
    "FARMERS",
    "FASHION",
    "FAST",
    "FEDEX",
    "FEEDBACK",
    "FERRARI",
    "FERRERO",
    "FI",
    "FIAT",
    "FIDELITY",
    "FIDO",
    "FILM",
    "FINAL",
    "FINANCE",
    "FINANCIAL",
    "FIRE",
    "FIRESTONE",
    "FIRMDALE",
    "FISH",
    "FISHING",
    "FIT",
    "FITNESS",
    "FJ",
    "FK",
    "FLICKR",
    "FLIGHTS",
    "FLIR",
    "FLORIST",
    "FLOWERS",
    "FLY",
    "FM",
    "FO",
    "FOO",
    "FOOD",
    "FOODNETWORK",
    "FOOTBALL",
    "FORD",
    "FOREX",
    "FORSALE",
    "FORUM",
    "FOUNDATION",
    "FOX",
    "FR",
    "FREE",
    "FRESENIUS",
    "FRL",
    "FROGANS",
    "FRONTDOOR",
    "FRONTIER",
    "FTR",
    "FUJITSU",
    "FUN",
    "FUND",
    "FURNITURE",
    "FUTBOL",
    "FYI",
    "GA",
    "GAL",
    "GALLERY",
    "GALLO",
    "GALLUP",
    "GAME",
    "GAMES",
    "GAP",
    "GARDEN",
    "GAY",
    "GB",
    "GBIZ",
    "GD",
    "GDN",
    "GE",
    "GEA",
    "GENT",
    "GENTING",
    "GEORGE",
    "GF",
    "GG",
    "GGEE",
    "GH",
    "GI",
    "GIFT",
    "GIFTS",
    "GIVES",
    "GIVING",
    "GL",
    "GLADE",
    "GLASS",
    "GLE",
    "GLOBAL",
    "GLOBO",
    "GM",
    "GMAIL",
    "GMBH",
    "GMO",
    "GMX",
    "GN",
    "GODADDY",
    "GOLD",
    "GOLDPOINT",
    "GOLF",
    "GOO",
    "GOODYEAR",
    "GOOG",
    "GOOGLE",
    "GOP",
    "GOT",
    "GOV",
    "GP",
    "GQ",
    "GR",
    "GRAINGER",
    "GRAPHICS",
    "GRATIS",
    "GREEN",
    "GRIPE",
    "GROCERY",
    "GROUP",
    "GS",
    "GT",
    "GU",
    "GUARDIAN",
    "GUCCI",
    "GUGE",
    "GUIDE",
    "GUITARS",
    "GURU",
    "GW",
    "GY",
    "HAIR",
    "HAMBURG",
    "HANGOUT",
    "HAUS",
    "HBO",
    "HDFC",
    "HDFCBANK",
    "HEALTH",
    "HEALTHCARE",
    "HELP",
    "HELSINKI",
    "HERE",
    "HERMES",
    "HGTV",
    "HIPHOP",
    "HISAMITSU",
    "HITACHI",
    "HIV",
    "HK",
    "HKT",
    "HM",
    "HN",
    "HOCKEY",
    "HOLDINGS",
    "HOLIDAY",
    "HOMEDEPOT",
    "HOMEGOODS",
    "HOMES",
    "HOMESENSE",
    "HONDA",
    "HORSE",
    "HOSPITAL",
    "HOST",
    "HOSTING",
    "HOT",
    "HOTELES",
    "HOTELS",
    "HOTMAIL",
    "HOUSE",
    "HOW",
    "HR",
    "HSBC",
    "HT",
    "HU",
    "HUGHES",
    "HYATT",
    "HYUNDAI",
    "IBM",
    "ICBC",
    "ICE",
    "ICU",
    "ID",
    "IE",
    "IEEE",
    "IFM",
    "IKANO",
    "IL",
    "IM",
    "IMAMAT",
    "IMDB",
    "IMMO",
    "IMMOBILIEN",
    "IN",
    "INC",
    "INDUSTRIES",
    "INFINITI",
    "INFO",
    "ING",
    "INK",
    "INSTITUTE",
    "INSURANCE",
    "INSURE",
    "INT",
    "INTERNATIONAL",
    "INTUIT",
    "INVESTMENTS",
    "IO",
    "IPIRANGA",
    "IQ",
    "IR",
    "IRISH",
    "IS",
    "ISMAILI",
    "IST",
    "ISTANBUL",
    "IT",
    "ITAU",
    "ITV",
    "JAGUAR",
    "JAVA",
    "JCB",
    "JE",
    "JEEP",
    "JETZT",
    "JEWELRY",
    "JIO",
    "JLL",
    "JM",
    "JMP",
    "JNJ",
    "JO",
    "JOBS",
    "JOBURG",
    "JOT",
    "JOY",
    "JP",
    "JPMORGAN",
    "JPRS",
    "JUEGOS",
    "JUNIPER",
    "KAUFEN",
    "KDDI",
    "KE",
    "KERRYHOTELS",
    "KERRYLOGISTICS",
    "KERRYPROPERTIES",
    "KFH",
    "KG",
    "KH",
    "KI",
    "KIA",
    "KIM",
    "KINDER",
    "KINDLE",
    "KITCHEN",
    "KIWI",
    "KM",
    "KN",
    "KOELN",
    "KOMATSU",
    "KOSHER",
    "KP",
    "KPMG",
    "KPN",
    "KR",
    "KRD",
    "KRED",
    "KUOKGROUP",
    "KW",
    "KY",
    "KYOTO",
    "KZ",
    "LA",
    "LACAIXA",
    "LAMBORGHINI",
    "LAMER",
    "LANCASTER",
    "LANCIA",
    "LAND",
    "LANDROVER",
    "LANXESS",
    "LASALLE",
    "LAT",
    "LATINO",
    "LATROBE",
    "LAW",
    "LAWYER",
    "LB",
    "LC",
    "LDS",
    "LEASE",
    "LECLERC",
    "LEFRAK",
    "LEGAL",
    "LEGO",
    "LEXUS",
    "LGBT",
    "LI",
    "LIDL",
    "LIFE",
    "LIFEINSURANCE",
    "LIFESTYLE",
    "LIGHTING",
    "LIKE",
    "LILLY",
    "LIMITED",
    "LIMO",
    "LINCOLN",
    "LINDE",
    "LINK",
    "LIPSY",
    "LIVE",
    "LIVING",
    "LIXIL",
    "LK",
    "LLC",
    "LLP",
    "LOAN",
    "LOANS",
    "LOCKER",
    "LOCUS",
    "LOFT",
    "LOL",
    "LONDON",
    "LOTTE",
    "LOTTO",
    "LOVE",
    "LPL",
    "LPLFINANCIAL",
    "LR",
    "LS",
    "LT",
    "LTD",
    "LTDA",
    "LU",
    "LUNDBECK",
    "LUXE",
    "LUXURY",
    "LV",
    "LY",
    "MA",
    "MACYS",
    "MADRID",
    "MAIF",
    "MAISON",
    "MAKEUP",
    "MAN",
    "MANAGEMENT",
    "MANGO",
    "MAP",
    "MARKET",
    "MARKETING",
    "MARKETS",
    "MARRIOTT",
    "MARSHALLS",
    "MASERATI",
    "MATTEL",
    "MBA",
    "MC",
    "MCKINSEY",
    "MD",
    "ME",
    "MED",
    "MEDIA",
    "MEET",
    "MELBOURNE",
    "MEME",
    "MEMORIAL",
    "MEN",
    "MENU",
    "MERCKMSD",
    "MG",
    "MH",
    "MIAMI",
    "MICROSOFT",
    "MIL",
    "MINI",
    "MINT",
    "MIT",
    "MITSUBISHI",
    "MK",
    "ML",
    "MLB",
    "MLS",
    "MM",
    "MMA",
    "MN",
    "MO",
    "MOBI",
    "MOBILE",
    "MODA",
    "MOE",
    "MOI",
    "MOM",
    "MONASH",
    "MONEY",
    "MONSTER",
    "MORMON",
    "MORTGAGE",
    "MOSCOW",
    "MOTO",
    "MOTORCYCLES",
    "MOV",
    "MOVIE",
    "MP",
    "MQ",
    "MR",
    "MS",
    "MSD",
    "MT",
    "MTN",
    "MTR",
    "MU",
    "MUSEUM",
    "MUTUAL",
    "MV",
    "MW",
    "MX",
    "MY",
    "MZ",
    "NA",
    "NAB",
    "NAGOYA",
    "NAME",
    "NATURA",
    "NAVY",
    "NBA",
    "NC",
    "NE",
    "NEC",
    "NET",
    "NETBANK",
    "NETFLIX",
    "NETWORK",
    "NEUSTAR",
    "NEW",
    "NEWS",
    "NEXT",
    "NEXTDIRECT",
    "NEXUS",
    "NF",
    "NFL",
    "NG",
    "NGO",
    "NHK",
    "NI",
    "NICO",
    "NIKE",
    "NIKON",
    "NINJA",
    "NISSAN",
    "NISSAY",
    "NL",
    "NO",
    "NOKIA",
    "NORTHWESTERNMUTUAL",
    "NORTON",
    "NOW",
    "NOWRUZ",
    "NOWTV",
    "NP",
    "NR",
    "NRA",
    "NRW",
    "NTT",
    "NU",
    "NYC",
    "NZ",
    "OBI",
    "OBSERVER",
    "OFF",
    "OFFICE",
    "OKINAWA",
    "OLAYAN",
    "OLAYANGROUP",
    "OLDNAVY",
    "OLLO",
    "OM",
    "OMEGA",
    "ONE",
    "ONG",
    "ONL",
    "ONLINE",
    "OOO",
    "OPEN",
    "ORACLE",
    "ORANGE",
    "ORG",
    "ORGANIC",
    "ORIGINS",
    "OSAKA",
    "OTSUKA",
    "OTT",
    "OVH",
    "PA",
    "PAGE",
    "PANASONIC",
    "PARIS",
    "PARS",
    "PARTNERS",
    "PARTS",
    "PARTY",
    "PASSAGENS",
    "PAY",
    "PCCW",
    "PE",
    "PET",
    "PF",
    "PFIZER",
    "PG",
    "PH",
    "PHARMACY",
    "PHD",
    "PHILIPS",
    "PHONE",
    "PHOTO",
    "PHOTOGRAPHY",
    "PHOTOS",
    "PHYSIO",
    "PICS",
    "PICTET",
    "PICTURES",
    "PID",
    "PIN",
    "PING",
    "PINK",
    "PIONEER",
    "PIZZA",
    "PK",
    "PL",
    "PLACE",
    "PLAY",
    "PLAYSTATION",
    "PLUMBING",
    "PLUS",
    "PM",
    "PN",
    "PNC",
    "POHL",
    "POKER",
    "POLITIE",
    "PORN",
    "POST",
    "PR",
    "PRAMERICA",
    "PRAXI",
    "PRESS",
    "PRIME",
    "PRO",
    "PROD",
    "PRODUCTIONS",
    "PROF",
    "PROGRESSIVE",
    "PROMO",
    "PROPERTIES",
    "PROPERTY",
    "PROTECTION",
    "PRU",
    "PRUDENTIAL",
    "PS",
    "PT",
    "PUB",
    "PW",
    "PWC",
    "PY",
    "QA",
    "QPON",
    "QUEBEC",
    "QUEST",
    "QVC",
    "RACING",
    "RADIO",
    "RAID",
    "RE",
    "READ",
    "REALESTATE",
    "REALTOR",
    "REALTY",
    "RECIPES",
    "RED",
    "REDSTONE",
    "REDUMBRELLA",
    "REHAB",
    "REISE",
    "REISEN",
    "REIT",
    "RELIANCE",
    "REN",
    "RENT",
    "RENTALS",
    "REPAIR",
    "REPORT",
    "REPUBLICAN",
    "REST",
    "RESTAURANT",
    "REVIEW",
    "REVIEWS",
    "REXROTH",
    "RICH",
    "RICHARDLI",
    "RICOH",
    "RIL",
    "RIO",
    "RIP",
    "RMIT",
    "RO",
    "ROCHER",
    "ROCKS",
    "RODEO",
    "ROGERS",
    "ROOM",
    "RS",
    "RSVP",
    "RU",
    "RUGBY",
    "RUHR",
    "RUN",
    "RW",
    "RWE",
    "RYUKYU",
    "SA",
    "SAARLAND",
    "SAFE",
    "SAFETY",
    "SAKURA",
    "SALE",
    "SALON",
    "SAMSCLUB",
    "SAMSUNG",
    "SANDVIK",
    "SANDVIKCOROMANT",
    "SANOFI",
    "SAP",
    "SARL",
    "SAS",
    "SAVE",
    "SAXO",
    "SB",
    "SBI",
    "SBS",
    "SC",
    "SCA",
    "SCB",
    "SCHAEFFLER",
    "SCHMIDT",
    "SCHOLARSHIPS",
    "SCHOOL",
    "SCHULE",
    "SCHWARZ",
    "SCIENCE",
    "SCJOHNSON",
    "SCOT",
    "SD",
    "SE",
    "SEARCH",
    "SEAT",
    "SECURE",
    "SECURITY",
    "SEEK",
    "SELECT",
    "SENER",
    "SERVICES",
    "SES",
    "SEVEN",
    "SEW",
    "SEX",
    "SEXY",
    "SFR",
    "SG",
    "SH",
    "SHANGRILA",
    "SHARP",
    "SHAW",
    "SHELL",
    "SHIA",
    "SHIKSHA",
    "SHOES",
    "SHOP",
    "SHOPPING",
    "SHOUJI",
    "SHOW",
    "SHOWTIME",
    "SI",
    "SILK",
    "SINA",
    "SINGLES",
    "SITE",
    "SJ",
    "SK",
    "SKI",
    "SKIN",
    "SKY",
    "SKYPE",
    "SL",
    "SLING",
    "SM",
    "SMART",
    "SMILE",
    "SN",
    "SNCF",
    "SO",
    "SOCCER",
    "SOCIAL",
    "SOFTBANK",
    "SOFTWARE",
    "SOHU",
    "SOLAR",
    "SOLUTIONS",
    "SONG",
    "SONY",
    "SOY",
    "SPA",
    "SPACE",
    "SPORT",
    "SPOT",
    "SR",
    "SRL",
    "SS",
    "ST",
    "STADA",
    "STAPLES",
    "STAR",
    "STATEBANK",
    "STATEFARM",
    "STC",
    "STCGROUP",
    "STOCKHOLM",
    "STORAGE",
    "STORE",
    "STREAM",
    "STUDIO",
    "STUDY",
    "STYLE",
    "SU",
    "SUCKS",
    "SUPPLIES",
    "SUPPLY",
    "SUPPORT",
    "SURF",
    "SURGERY",
    "SUZUKI",
    "SV",
    "SWATCH",
    "SWIFTCOVER",
    "SWISS",
    "SX",
    "SY",
    "SYDNEY",
    "SYSTEMS",
    "SZ",
    "TAB",
    "TAIPEI",
    "TALK",
    "TAOBAO",
    "TARGET",
    "TATAMOTORS",
    "TATAR",
    "TATTOO",
    "TAX",
    "TAXI",
    "TC",
    "TCI",
    "TD",
    "TDK",
    "TEAM",
    "TECH",
    "TECHNOLOGY",
    "TEL",
    "TEMASEK",
    "TENNIS",
    "TEVA",
    "TF",
    "TG",
    "TH",
    "THD",
    "THEATER",
    "THEATRE",
    "TIAA",
    "TICKETS",
    "TIENDA",
    "TIFFANY",
    "TIPS",
    "TIRES",
    "TIROL",
    "TJ",
    "TJMAXX",
    "TJX",
    "TK",
    "TKMAXX",
    "TL",
    "TM",
    "TMALL",
    "TN",
    "TO",
    "TODAY",
    "TOKYO",
    "TOOLS",
    "TOP",
    "TORAY",
    "TOSHIBA",
    "TOTAL",
    "TOURS",
    "TOWN",
    "TOYOTA",
    "TOYS",
    "TR",
    "TRADE",
    "TRADING",
    "TRAINING",
    "TRAVEL",
    "TRAVELCHANNEL",
    "TRAVELERS",
    "TRAVELERSINSURANCE",
    "TRUST",
    "TRV",
    "TT",
    "TUBE",
    "TUI",
    "TUNES",
    "TUSHU",
    "TV",
    "TVS",
    "TW",
    "TZ",
    "UA",
    "UBANK",
    "UBS",
    "UG",
    "UK",
    "UNICOM",
    "UNIVERSITY",
    "UNO",
    "UOL",
    "UPS",
    "US",
    "UY",
    "UZ",
    "VA",
    "VACATIONS",
    "VANA",
    "VANGUARD",
    "VC",
    "VE",
    "VEGAS",
    "VENTURES",
    "VERISIGN",
    "VERSICHERUNG",
    "VET",
    "VG",
    "VI",
    "VIAJES",
    "VIDEO",
    "VIG",
    "VIKING",
    "VILLAS",
    "VIN",
    "VIP",
    "VIRGIN",
    "VISA",
    "VISION",
    "VIVA",
    "VIVO",
    "VLAANDEREN",
    "VN",
    "VODKA",
    "VOLKSWAGEN",
    "VOLVO",
    "VOTE",
    "VOTING",
    "VOTO",
    "VOYAGE",
    "VU",
    "VUELOS",
    "WALES",
    "WALMART",
    "WALTER",
    "WANG",
    "WANGGOU",
    "WATCH",
    "WATCHES",
    "WEATHER",
    "WEATHERCHANNEL",
    "WEBCAM",
    "WEBER",
    "WEBSITE",
    "WED",
    "WEDDING",
    "WEIBO",
    "WEIR",
    "WF",
    "WHOSWHO",
    "WIEN",
    "WIKI",
    "WILLIAMHILL",
    "WIN",
    "WINDOWS",
    "WINE",
    "WINNERS",
    "WME",
    "WOLTERSKLUWER",
    "WOODSIDE",
    "WORK",
    "WORKS",
    "WORLD",
    "WOW",
    "WS",
    "WTC",
    "WTF",
    "XBOX",
    "XEROX",
    "XFINITY",
    "XIHUAN",
    "XIN",
    "XN--11B4C3D",
    "XN--1CK2E1B",
    "XN--1QQW23A",
    "XN--2SCRJ9C",
    "XN--30RR7Y",
    "XN--3BST00M",
    "XN--3DS443G",
    "XN--3E0B707E",
    "XN--3HCRJ9C",
    "XN--3OQ18VL8PN36A",
    "XN--3PXU8K",
    "XN--42C2D9A",
    "XN--45BR5CYL",
    "XN--45BRJ9C",
    "XN--45Q11C",
    "XN--4DBRK0CE",
    "XN--4GBRIM",
    "XN--54B7FTA0CC",
    "XN--55QW42G",
    "XN--55QX5D",
    "XN--5SU34J936BGSG",
    "XN--5TZM5G",
    "XN--6FRZ82G",
    "XN--6QQ986B3XL",
    "XN--80ADXHKS",
    "XN--80AO21A",
    "XN--80AQECDR1A",
    "XN--80ASEHDB",
    "XN--80ASWG",
    "XN--8Y0A063A",
    "XN--90A3AC",
    "XN--90AE",
    "XN--90AIS",
    "XN--9DBQ2A",
    "XN--9ET52U",
    "XN--9KRT00A",
    "XN--B4W605FERD",
    "XN--BCK1B9A5DRE4C",
    "XN--C1AVG",
    "XN--C2BR7G",
    "XN--CCK2B3B",
    "XN--CCKWCXETD",
    "XN--CG4BKI",
    "XN--CLCHC0EA0B2G2A9GCD",
    "XN--CZR694B",
    "XN--CZRS0T",
    "XN--CZRU2D",
    "XN--D1ACJ3B",
    "XN--D1ALF",
    "XN--E1A4C",
    "XN--ECKVDTC9D",
    "XN--EFVY88H",
    "XN--FCT429K",
    "XN--FHBEI",
    "XN--FIQ228C5HS",
    "XN--FIQ64B",
    "XN--FIQS8S",
    "XN--FIQZ9S",
    "XN--FJQ720A",
    "XN--FLW351E",
    "XN--FPCRJ9C3D",
    "XN--FZC2C9E2C",
    "XN--FZYS8D69UVGM",
    "XN--G2XX48C",
    "XN--GCKR3F0F",
    "XN--GECRJ9C",
    "XN--GK3AT1E",
    "XN--H2BREG3EVE",
    "XN--H2BRJ9C",
    "XN--H2BRJ9C8C",
    "XN--HXT814E",
    "XN--I1B6B1A6A2E",
    "XN--IMR513N",
    "XN--IO0A7I",
    "XN--J1AEF",
    "XN--J1AMH",
    "XN--J6W193G",
    "XN--JLQ480N2RG",
    "XN--JLQ61U9W7B",
    "XN--JVR189M",
    "XN--KCRX77D1X4A",
    "XN--KPRW13D",
    "XN--KPRY57D",
    "XN--KPUT3I",
    "XN--L1ACC",
    "XN--LGBBAT1AD8J",
    "XN--MGB9AWBF",
    "XN--MGBA3A3EJT",
    "XN--MGBA3A4F16A",
    "XN--MGBA7C0BBN0A",
    "XN--MGBAAKC7DVF",
    "XN--MGBAAM7A8H",
    "XN--MGBAB2BD",
    "XN--MGBAH1A3HJKRD",
    "XN--MGBAI9AZGQP6J",
    "XN--MGBAYH7GPA",
    "XN--MGBBH1A",
    "XN--MGBBH1A71E",
    "XN--MGBC0A9AZCG",
    "XN--MGBCA7DZDO",
    "XN--MGBCPQ6GPA1A",
    "XN--MGBERP4A5D4AR",
    "XN--MGBGU82A",
    "XN--MGBI4ECEXP",
    "XN--MGBPL2FH",
    "XN--MGBT3DHD",
    "XN--MGBTX2B",
    "XN--MGBX4CD0AB",
    "XN--MIX891F",
    "XN--MK1BU44C",
    "XN--MXTQ1M",
    "XN--NGBC5AZD",
    "XN--NGBE9E0A",
    "XN--NGBRX",
    "XN--NODE",
    "XN--NQV7F",
    "XN--NQV7FS00EMA",
    "XN--NYQY26A",
    "XN--O3CW4H",
    "XN--OGBPF8FL",
    "XN--OTU796D",
    "XN--P1ACF",
    "XN--P1AI",
    "XN--PGBS0DH",
    "XN--PSSY2U",
    "XN--Q7CE6A",
    "XN--Q9JYB4C",
    "XN--QCKA1PMC",
    "XN--QXA6A",
    "XN--QXAM",
    "XN--RHQV96G",
    "XN--ROVU88B",
    "XN--RVC1E0AM3E",
    "XN--S9BRJ9C",
    "XN--SES554G",
    "XN--T60B56A",
    "XN--TCKWE",
    "XN--TIQ49XQYJ",
    "XN--UNUP4Y",
    "XN--VERMGENSBERATER-CTB",
    "XN--VERMGENSBERATUNG-PWB",
    "XN--VHQUV",
    "XN--VUQ861B",
    "XN--W4R85EL8FHU5DNRA",
    "XN--W4RS40L",
    "XN--WGBH1C",
    "XN--WGBL6A",
    "XN--XHQ521B",
    "XN--XKC2AL3HYE2A",
    "XN--XKC2DL3A5EE0H",
    "XN--Y9A3AQ",
    "XN--YFRO4I67O",
    "XN--YGBI2AMMX",
    "XN--ZFR164B",
    "XXX",
    "XYZ",
    "YACHTS",
    "YAHOO",
    "YAMAXUN",
    "YANDEX",
    "YE",
    "YODOBASHI",
    "YOGA",
    "YOKOHAMA",
    "YOU",
    "YOUTUBE",
    "YT",
    "YUN",
    "ZA",
    "ZAPPOS",
    "ZARA",
    "ZERO",
    "ZIP",
    "ZM",
    "ZONE",
    "ZUERICH",
    "ZW"
];

var faIcons = [
    'fas fa-abacus',
    'fas fa-acorn',
    'fas fa-ad',
    'fas fa-address-book',
    'fas fa-address-card',
    'fas fa-adjust',
    'fas fa-air-conditioner',
    'fas fa-air-freshener',
    'fas fa-alarm-clock',
    'fas fa-alarm-exclamation',
    'fas fa-alarm-plus',
    'fas fa-alarm-snooze',
    'fas fa-album',
    'fas fa-album-collection',
    'fas fa-alicorn',
    'fas fa-alien',
    'fas fa-alien-monster',
    'fas fa-align-center',
    'fas fa-align-justify',
    'fas fa-align-left',
    'fas fa-align-right',
    'fas fa-align-slash',
    'fas fa-allergies',
    'fas fa-ambulance',
    'fas fa-american-sign-language-interpreting',
    'fas fa-amp-guitar',
    'fas fa-analytics',
    'fas fa-anchor',
    'fas fa-angel',
    'fas fa-angle-double-down',
    'fas fa-angle-double-left',
    'fas fa-angle-double-right',
    'fas fa-angle-double-up',
    'fas fa-angle-down',
    'fas fa-angle-left',
    'fas fa-angle-right',
    'fas fa-angle-up',
    'fas fa-angry',
    'fas fa-ankh',
    'fas fa-apple-alt',
    'fas fa-apple-crate',
    'fas fa-archive',
    'fas fa-archway',
    'fas fa-arrow-alt-circle-down',
    'fas fa-arrow-alt-circle-left',
    'fas fa-arrow-alt-circle-right',
    'fas fa-arrow-alt-circle-up',
    'fas fa-arrow-alt-down',
    'fas fa-arrow-alt-from-bottom',
    'fas fa-arrow-alt-from-left',
    'fas fa-arrow-alt-from-right',
    'fas fa-arrow-alt-from-top',
    'fas fa-arrow-alt-left',
    'fas fa-arrow-alt-right',
    'fas fa-arrow-alt-square-down',
    'fas fa-arrow-alt-square-left',
    'fas fa-arrow-alt-square-right',
    'fas fa-arrow-alt-square-up',
    'fas fa-arrow-alt-to-bottom',
    'fas fa-arrow-alt-to-left',
    'fas fa-arrow-alt-to-right',
    'fas fa-arrow-alt-to-top',
    'fas fa-arrow-alt-up',
    'fas fa-arrow-circle-down',
    'fas fa-arrow-circle-left',
    'fas fa-arrow-circle-right',
    'fas fa-arrow-circle-up',
    'fas fa-arrow-down',
    'fas fa-arrow-from-bottom',
    'fas fa-arrow-from-left',
    'fas fa-arrow-from-right',
    'fas fa-arrow-from-top',
    'fas fa-arrow-left',
    'fas fa-arrow-right',
    'fas fa-arrow-square-down',
    'fas fa-arrow-square-left',
    'fas fa-arrow-square-right',
    'fas fa-arrow-square-up',
    'fas fa-arrow-to-bottom',
    'fas fa-arrow-to-left',
    'fas fa-arrow-to-right',
    'fas fa-arrow-to-top',
    'fas fa-arrow-up',
    'fas fa-arrows',
    'fas fa-arrows-alt',
    'fas fa-arrows-alt-h',
    'fas fa-arrows-alt-v',
    'fas fa-arrows-h',
    'fas fa-arrows-v',
    'fas fa-assistive-listening-systems',
    'fas fa-asterisk',
    'fas fa-at',
    'fas fa-atlas',
    'fas fa-atom',
    'fas fa-atom-alt',
    'fas fa-audio-description',
    'fas fa-award',
    'fas fa-axe',
    'fas fa-axe-battle',
    'fas fa-baby',
    'fas fa-baby-carriage',
    'fas fa-backpack',
    'fas fa-backspace',
    'fas fa-backward',
    'fas fa-bacon',
    'fas fa-bacteria',
    'fas fa-bacterium',
    'fas fa-badge',
    'fas fa-badge-check',
    'fas fa-badge-dollar',
    'fas fa-badge-percent',
    'fas fa-badge-sheriff',
    'fas fa-badger-honey',
    'fas fa-bags-shopping',
    'fas fa-bahai',
    'fas fa-balance-scale',
    'fas fa-balance-scale-left',
    'fas fa-balance-scale-right',
    'fas fa-ball-pile',
    'fas fa-ballot',
    'fas fa-ballot-check',
    'fas fa-ban',
    'fas fa-band-aid',
    'fas fa-banjo',
    'fas fa-barcode',
    'fas fa-barcode-alt',
    'fas fa-barcode-read',
    'fas fa-barcode-scan',
    'fas fa-bars',
    'fas fa-baseball',
    'fas fa-baseball-ball',
    'fas fa-basketball-ball',
    'fas fa-basketball-hoop',
    'fas fa-bat',
    'fas fa-bath',
    'fas fa-battery-bolt',
    'fas fa-battery-empty',
    'fas fa-battery-full',
    'fas fa-battery-half',
    'fas fa-battery-quarter',
    'fas fa-battery-slash',
    'fas fa-battery-three-quarters',
    'fas fa-bed',
    'fas fa-bed-alt',
    'fas fa-bed-bunk',
    'fas fa-bed-empty',
    'fas fa-beer',
    'fas fa-bell',
    'fas fa-bell-exclamation',
    'fas fa-bell-on',
    'fas fa-bell-plus',
    'fas fa-bell-school',
    'fas fa-bell-school-slash',
    'fas fa-bell-slash',
    'fas fa-bells',
    'fas fa-betamax',
    'fas fa-bezier-curve',
    'fas fa-bible',
    'fas fa-bicycle',
    'fas fa-biking',
    'fas fa-biking-mountain',
    'fas fa-binoculars',
    'fas fa-biohazard',
    'fas fa-birthday-cake',
    'fas fa-blanket',
    'fas fa-blender',
    'fas fa-blender-phone',
    'fas fa-blind',
    'fas fa-blinds',
    'fas fa-blinds-open',
    'fas fa-blinds-raised',
    'fas fa-blog',
    'fas fa-bold',
    'fas fa-bolt',
    'fas fa-bomb',
    'fas fa-bone',
    'fas fa-bone-break',
    'fas fa-bong',
    'fas fa-book',
    'fas fa-book-alt',
    'fas fa-book-dead',
    'fas fa-book-heart',
    'fas fa-book-medical',
    'fas fa-book-open',
    'fas fa-book-reader',
    'fas fa-book-spells',
    'fas fa-book-user',
    'fas fa-bookmark',
    'fas fa-books',
    'fas fa-books-medical',
    'fas fa-boombox',
    'fas fa-boot',
    'fas fa-booth-curtain',
    'fas fa-border-all',
    'fas fa-border-bottom',
    'fas fa-border-center-h',
    'fas fa-border-center-v',
    'fas fa-border-inner',
    'fas fa-border-left',
    'fas fa-border-none',
    'fas fa-border-outer',
    'fas fa-border-right',
    'fas fa-border-style',
    'fas fa-border-style-alt',
    'fas fa-border-top',
    'fas fa-bow-arrow',
    'fas fa-bowling-ball',
    'fas fa-bowling-pins',
    'fas fa-box',
    'fas fa-box-alt',
    'fas fa-box-ballot',
    'fas fa-box-check',
    'fas fa-box-fragile',
    'fas fa-box-full',
    'fas fa-box-heart',
    'fas fa-box-open',
    'fas fa-box-tissue',
    'fas fa-box-up',
    'fas fa-box-usd',
    'fas fa-boxes',
    'fas fa-boxes-alt',
    'fas fa-boxing-glove',
    'fas fa-brackets',
    'fas fa-brackets-curly',
    'fas fa-braille',
    'fas fa-brain',
    'fas fa-bread-loaf',
    'fas fa-bread-slice',
    'fas fa-briefcase',
    'fas fa-briefcase-medical',
    'fas fa-bring-forward',
    'fas fa-bring-front',
    'fas fa-broadcast-tower',
    'fas fa-broom',
    'fas fa-browser',
    'fas fa-brush',
    'fas fa-bug',
    'fas fa-building',
    'fas fa-bullhorn',
    'fas fa-bullseye',
    'fas fa-bullseye-arrow',
    'fas fa-bullseye-pointer',
    'fas fa-burger-soda',
    'fas fa-burn',
    'fas fa-burrito',
    'fas fa-bus',
    'fas fa-bus-alt',
    'fas fa-bus-school',
    'fas fa-business-time',
    'fas fa-cabinet-filing',
    'fas fa-cactus',
    'fas fa-calculator',
    'fas fa-calculator-alt',
    'fas fa-calendar',
    'fas fa-calendar-alt',
    'fas fa-calendar-check',
    'fas fa-calendar-day',
    'fas fa-calendar-edit',
    'fas fa-calendar-exclamation',
    'fas fa-calendar-minus',
    'fas fa-calendar-plus',
    'fas fa-calendar-star',
    'fas fa-calendar-times',
    'fas fa-calendar-week',
    'fas fa-camcorder',
    'fas fa-camera',
    'fas fa-camera-alt',
    'fas fa-camera-home',
    'fas fa-camera-movie',
    'fas fa-camera-polaroid',
    'fas fa-camera-retro',
    'fas fa-campfire',
    'fas fa-campground',
    'fas fa-candle-holder',
    'fas fa-candy-cane',
    'fas fa-candy-corn',
    'fas fa-cannabis',
    'fas fa-capsules',
    'fas fa-car',
    'fas fa-car-alt',
    'fas fa-car-battery',
    'fas fa-car-building',
    'fas fa-car-bump',
    'fas fa-car-bus',
    'fas fa-car-crash',
    'fas fa-car-garage',
    'fas fa-car-mechanic',
    'fas fa-car-side',
    'fas fa-car-tilt',
    'fas fa-car-wash',
    'fas fa-caravan',
    'fas fa-caravan-alt',
    'fas fa-caret-circle-down',
    'fas fa-caret-circle-left',
    'fas fa-caret-circle-right',
    'fas fa-caret-circle-up',
    'fas fa-caret-down',
    'fas fa-caret-left',
    'fas fa-caret-right',
    'fas fa-caret-square-down',
    'fas fa-caret-square-left',
    'fas fa-caret-square-right',
    'fas fa-caret-square-up',
    'fas fa-caret-up',
    'fas fa-carrot',
    'fas fa-cars',
    'fas fa-cart-arrow-down',
    'fas fa-cart-plus',
    'fas fa-cash-register',
    'fas fa-cassette-tape',
    'fas fa-cat',
    'fas fa-cat-space',
    'fas fa-cauldron',
    'fas fa-cctv',
    'fas fa-certificate',
    'fas fa-chair',
    'fas fa-chair-office',
    'fas fa-chalkboard',
    'fas fa-chalkboard-teacher',
    'fas fa-charging-station',
    'fas fa-chart-area',
    'fas fa-chart-bar',
    'fas fa-chart-line',
    'fas fa-chart-line-down',
    'fas fa-chart-network',
    'fas fa-chart-pie',
    'fas fa-chart-pie-alt',
    'fas fa-chart-scatter',
    'fas fa-check',
    'fas fa-check-circle',
    'fas fa-check-double',
    'fas fa-check-square',
    'fas fa-cheese',
    'fas fa-cheese-swiss',
    'fas fa-cheeseburger',
    'fas fa-chess',
    'fas fa-chess-bishop',
    'fas fa-chess-bishop-alt',
    'fas fa-chess-board',
    'fas fa-chess-clock',
    'fas fa-chess-clock-alt',
    'fas fa-chess-king',
    'fas fa-chess-king-alt',
    'fas fa-chess-knight',
    'fas fa-chess-knight-alt',
    'fas fa-chess-pawn',
    'fas fa-chess-pawn-alt',
    'fas fa-chess-queen',
    'fas fa-chess-queen-alt',
    'fas fa-chess-rook',
    'fas fa-chess-rook-alt',
    'fas fa-chevron-circle-down',
    'fas fa-chevron-circle-left',
    'fas fa-chevron-circle-right',
    'fas fa-chevron-circle-up',
    'fas fa-chevron-double-down',
    'fas fa-chevron-double-left',
    'fas fa-chevron-double-right',
    'fas fa-chevron-double-up',
    'fas fa-chevron-down',
    'fas fa-chevron-left',
    'fas fa-chevron-right',
    'fas fa-chevron-square-down',
    'fas fa-chevron-square-left',
    'fas fa-chevron-square-right',
    'fas fa-chevron-square-up',
    'fas fa-chevron-up',
    'fas fa-child',
    'fas fa-chimney',
    'fas fa-church',
    'fas fa-circle',
    'fas fa-circle-notch',
    'fas fa-city',
    'fas fa-clarinet',
    'fas fa-claw-marks',
    'fas fa-clinic-medical',
    'fas fa-clipboard',
    'fas fa-clipboard-check',
    'fas fa-clipboard-list',
    'fas fa-clipboard-list-check',
    'fas fa-clipboard-prescription',
    'fas fa-clipboard-user',
    'fas fa-clock',
    'fas fa-clone',
    'fas fa-closed-captioning',
    'fas fa-cloud',
    'fas fa-cloud-download',
    'fas fa-cloud-download-alt',
    'fas fa-cloud-drizzle',
    'fas fa-cloud-hail',
    'fas fa-cloud-hail-mixed',
    'fas fa-cloud-meatball',
    'fas fa-cloud-moon',
    'fas fa-cloud-moon-rain',
    'fas fa-cloud-music',
    'fas fa-cloud-rain',
    'fas fa-cloud-rainbow',
    'fas fa-cloud-showers',
    'fas fa-cloud-showers-heavy',
    'fas fa-cloud-sleet',
    'fas fa-cloud-snow',
    'fas fa-cloud-sun',
    'fas fa-cloud-sun-rain',
    'fas fa-cloud-upload',
    'fas fa-cloud-upload-alt',
    'fas fa-clouds',
    'fas fa-clouds-moon',
    'fas fa-clouds-sun',
    'fas fa-club',
    'fas fa-cocktail',
    'fas fa-code',
    'fas fa-code-branch',
    'fas fa-code-commit',
    'fas fa-code-merge',
    'fas fa-coffee',
    'fas fa-coffee-pot',
    'fas fa-coffee-togo',
    'fas fa-coffin',
    'fas fa-coffin-cross',
    'fas fa-cog',
    'fas fa-cogs',
    'fas fa-coin',
    'fas fa-coins',
    'fas fa-columns',
    'fas fa-comet',
    'fas fa-comment',
    'fas fa-comment-alt',
    'fas fa-comment-alt-check',
    'fas fa-comment-alt-dollar',
    'fas fa-comment-alt-dots',
    'fas fa-comment-alt-edit',
    'fas fa-comment-alt-exclamation',
    'fas fa-comment-alt-lines',
    'fas fa-comment-alt-medical',
    'fas fa-comment-alt-minus',
    'fas fa-comment-alt-music',
    'fas fa-comment-alt-plus',
    'fas fa-comment-alt-slash',
    'fas fa-comment-alt-smile',
    'fas fa-comment-alt-times',
    'fas fa-comment-check',
    'fas fa-comment-dollar',
    'fas fa-comment-dots',
    'fas fa-comment-edit',
    'fas fa-comment-exclamation',
    'fas fa-comment-lines',
    'fas fa-comment-medical',
    'fas fa-comment-minus',
    'fas fa-comment-music',
    'fas fa-comment-plus',
    'fas fa-comment-slash',
    'fas fa-comment-smile',
    'fas fa-comment-times',
    'fas fa-comments',
    'fas fa-comments-alt',
    'fas fa-comments-alt-dollar',
    'fas fa-comments-dollar',
    'fas fa-compact-disc',
    'fas fa-compass',
    'fas fa-compass-slash',
    'fas fa-compress',
    'fas fa-compress-alt',
    'fas fa-compress-arrows-alt',
    'fas fa-compress-wide',
    'fas fa-computer-classic',
    'fas fa-computer-speaker',
    'fas fa-concierge-bell',
    'fas fa-construction',
    'fas fa-container-storage',
    'fas fa-conveyor-belt',
    'fas fa-conveyor-belt-alt',
    'fas fa-cookie',
    'fas fa-cookie-bite',
    'fas fa-copy',
    'fas fa-copyright',
    'fas fa-corn',
    'fas fa-couch',
    'fas fa-cow',
    'fas fa-cowbell',
    'fas fa-cowbell-more',
    'fas fa-credit-card',
    'fas fa-credit-card-blank',
    'fas fa-credit-card-front',
    'fas fa-cricket',
    'fas fa-croissant',
    'fas fa-crop',
    'fas fa-crop-alt',
    'fas fa-cross',
    'fas fa-crosshairs',
    'fas fa-crow',
    'fas fa-crown',
    'fas fa-crutch',
    'fas fa-crutches',
    'fas fa-cube',
    'fas fa-cubes',
    'fas fa-curling',
    'fas fa-cut',
    'fas fa-dagger',
    'fas fa-database',
    'fas fa-deaf',
    'fas fa-debug',
    'fas fa-deer',
    'fas fa-deer-rudolph',
    'fas fa-democrat',
    'fas fa-desktop',
    'fas fa-desktop-alt',
    'fas fa-dewpoint',
    'fas fa-dharmachakra',
    'fas fa-diagnoses',
    'fas fa-diamond',
    'fas fa-dice',
    'fas fa-dice-d10',
    'fas fa-dice-d12',
    'fas fa-dice-d20',
    'fas fa-dice-d4',
    'fas fa-dice-d6',
    'fas fa-dice-d8',
    'fas fa-dice-five',
    'fas fa-dice-four',
    'fas fa-dice-one',
    'fas fa-dice-six',
    'fas fa-dice-three',
    'fas fa-dice-two',
    'fas fa-digging',
    'fas fa-digital-tachograph',
    'fas fa-diploma',
    'fas fa-directions',
    'fas fa-disc-drive',
    'fas fa-disease',
    'fas fa-divide',
    'fas fa-dizzy',
    'fas fa-dna',
    'fas fa-do-not-enter',
    'fas fa-dog',
    'fas fa-dog-leashed',
    'fas fa-dollar-sign',
    'fas fa-dolly',
    'fas fa-dolly-empty',
    'fas fa-dolly-flatbed',
    'fas fa-dolly-flatbed-alt',
    'fas fa-dolly-flatbed-empty',
    'fas fa-donate',
    'fas fa-door-closed',
    'fas fa-door-open',
    'fas fa-dot-circle',
    'fas fa-dove',
    'fas fa-download',
    'fas fa-drafting-compass',
    'fas fa-dragon',
    'fas fa-draw-circle',
    'fas fa-draw-polygon',
    'fas fa-draw-square',
    'fas fa-dreidel',
    'fas fa-drone',
    'fas fa-drone-alt',
    'fas fa-drum',
    'fas fa-drum-steelpan',
    'fas fa-drumstick',
    'fas fa-drumstick-bite',
    'fas fa-dryer',
    'fas fa-dryer-alt',
    'fas fa-duck',
    'fas fa-dumbbell',
    'fas fa-dumpster',
    'fas fa-dumpster-fire',
    'fas fa-dungeon',
    'fas fa-ear',
    'fas fa-ear-muffs',
    'fas fa-eclipse',
    'fas fa-eclipse-alt',
    'fas fa-edit',
    'fas fa-egg',
    'fas fa-egg-fried',
    'fas fa-eject',
    'fas fa-elephant',
    'fas fa-ellipsis-h',
    'fas fa-ellipsis-h-alt',
    'fas fa-ellipsis-v',
    'fas fa-ellipsis-v-alt',
    'fas fa-empty-set',
    'fas fa-engine-warning',
    'fas fa-envelope',
    'fas fa-envelope-open',
    'fas fa-envelope-open-dollar',
    'fas fa-envelope-open-text',
    'fas fa-envelope-square',
    'fas fa-equals',
    'fas fa-eraser',
    'fas fa-ethernet',
    'fas fa-euro-sign',
    'fas fa-exchange',
    'fas fa-exchange-alt',
    'fas fa-exclamation',
    'fas fa-exclamation-circle',
    'fas fa-exclamation-square',
    'fas fa-exclamation-triangle',
    'fas fa-expand',
    'fas fa-expand-alt',
    'fas fa-expand-arrows',
    'fas fa-expand-arrows-alt',
    'fas fa-expand-wide',
    'fas fa-external-link',
    'fas fa-external-link-alt',
    'fas fa-external-link-square',
    'fas fa-external-link-square-alt',
    'fas fa-eye',
    'fas fa-eye-dropper',
    'fas fa-eye-evil',
    'fas fa-eye-slash',
    'fas fa-fan',
    'fas fa-fan-table',
    'fas fa-farm',
    'fas fa-fast-backward',
    'fas fa-fast-forward',
    'fas fa-faucet',
    'fas fa-faucet-drip',
    'fas fa-fax',
    'fas fa-feather',
    'fas fa-feather-alt',
    'fas fa-female',
    'fas fa-field-hockey',
    'fas fa-fighter-jet',
    'fas fa-file',
    'fas fa-file-alt',
    'fas fa-file-archive',
    'fas fa-file-audio',
    'fas fa-file-certificate',
    'fas fa-file-chart-line',
    'fas fa-file-chart-pie',
    'fas fa-file-check',
    'fas fa-file-code',
    'fas fa-file-contract',
    'fas fa-file-csv',
    'fas fa-file-download',
    'fas fa-file-edit',
    'fas fa-file-excel',
    'fas fa-file-exclamation',
    'fas fa-file-export',
    'fas fa-file-image',
    'fas fa-file-import',
    'fas fa-file-invoice',
    'fas fa-file-invoice-dollar',
    'fas fa-file-medical',
    'fas fa-file-medical-alt',
    'fas fa-file-minus',
    'fas fa-file-music',
    'fas fa-file-pdf',
    'fas fa-file-plus',
    'fas fa-file-powerpoint',
    'fas fa-file-prescription',
    'fas fa-file-search',
    'fas fa-file-signature',
    'fas fa-file-spreadsheet',
    'fas fa-file-times',
    'fas fa-file-upload',
    'fas fa-file-user',
    'fas fa-file-video',
    'fas fa-file-word',
    'fas fa-files-medical',
    'fas fa-fill',
    'fas fa-fill-drip',
    'fas fa-film',
    'fas fa-film-alt',
    'fas fa-film-canister',
    'fas fa-filter',
    'fas fa-fingerprint',
    'fas fa-fire',
    'fas fa-fire-alt',
    'fas fa-fire-extinguisher',
    'fas fa-fire-smoke',
    'fas fa-fireplace',
    'fas fa-first-aid',
    'fas fa-fish',
    'fas fa-fish-cooked',
    'fas fa-fist-raised',
    'fas fa-flag',
    'fas fa-flag-alt',
    'fas fa-flag-checkered',
    'fas fa-flag-usa',
    'fas fa-flame',
    'fas fa-flashlight',
    'fas fa-flask',
    'fas fa-flask-poison',
    'fas fa-flask-potion',
    'fas fa-flower',
    'fas fa-flower-daffodil',
    'fas fa-flower-tulip',
    'fas fa-flushed',
    'fas fa-flute',
    'fas fa-flux-capacitor',
    'fas fa-fog',
    'fas fa-folder',
    'fas fa-folder-download',
    'fas fa-folder-minus',
    'fas fa-folder-open',
    'fas fa-folder-plus',
    'fas fa-folder-times',
    'fas fa-folder-tree',
    'fas fa-folder-upload',
    'fas fa-folders',
    'fas fa-font',
    'fas fa-font-case',
    'fas fa-football-ball',
    'fas fa-football-helmet',
    'fas fa-forklift',
    'fas fa-forward',
    'fas fa-fragile',
    'fas fa-french-fries',
    'fas fa-frog',
    'fas fa-frosty-head',
    'fas fa-frown',
    'fas fa-frown-open',
    'fas fa-function',
    'fas fa-funnel-dollar',
    'fas fa-futbol',
    'fas fa-galaxy',
    'fas fa-game-board',
    'fas fa-game-board-alt',
    'fas fa-game-console-handheld',
    'fas fa-gamepad',
    'fas fa-gamepad-alt',
    'fas fa-garage',
    'fas fa-garage-car',
    'fas fa-garage-open',
    'fas fa-gas-pump',
    'fas fa-gas-pump-slash',
    'fas fa-gavel',
    'fas fa-gem',
    'fas fa-genderless',
    'fas fa-ghost',
    'fas fa-gift',
    'fas fa-gift-card',
    'fas fa-gifts',
    'fas fa-gingerbread-man',
    'fas fa-glass',
    'fas fa-glass-champagne',
    'fas fa-glass-cheers',
    'fas fa-glass-citrus',
    'fas fa-glass-martini',
    'fas fa-glass-martini-alt',
    'fas fa-glass-whiskey',
    'fas fa-glass-whiskey-rocks',
    'fas fa-glasses',
    'fas fa-glasses-alt',
    'fas fa-globe',
    'fas fa-globe-africa',
    'fas fa-globe-americas',
    'fas fa-globe-asia',
    'fas fa-globe-europe',
    'fas fa-globe-snow',
    'fas fa-globe-stand',
    'fas fa-golf-ball',
    'fas fa-golf-club',
    'fas fa-gopuram',
    'fas fa-graduation-cap',
    'fas fa-gramophone',
    'fas fa-greater-than',
    'fas fa-greater-than-equal',
    'fas fa-grimace',
    'fas fa-grin',
    'fas fa-grin-alt',
    'fas fa-grin-beam',
    'fas fa-grin-beam-sweat',
    'fas fa-grin-hearts',
    'fas fa-grin-squint',
    'fas fa-grin-squint-tears',
    'fas fa-grin-stars',
    'fas fa-grin-tears',
    'fas fa-grin-tongue',
    'fas fa-grin-tongue-squint',
    'fas fa-grin-tongue-wink',
    'fas fa-grin-wink',
    'fas fa-grip-horizontal',
    'fas fa-grip-lines',
    'fas fa-grip-lines-vertical',
    'fas fa-grip-vertical',
    'fas fa-guitar',
    'fas fa-guitar-electric',
    'fas fa-guitars',
    'fas fa-h-square',
    'fas fa-h1',
    'fas fa-h2',
    'fas fa-h3',
    'fas fa-h4',
    'fas fa-hamburger',
    'fas fa-hammer',
    'fas fa-hammer-war',
    'fas fa-hamsa',
    'fas fa-hand-heart',
    'fas fa-hand-holding',
    'fas fa-hand-holding-box',
    'fas fa-hand-holding-heart',
    'fas fa-hand-holding-magic',
    'fas fa-hand-holding-medical',
    'fas fa-hand-holding-seedling',
    'fas fa-hand-holding-usd',
    'fas fa-hand-holding-water',
    'fas fa-hand-lizard',
    'fas fa-hand-middle-finger',
    'fas fa-hand-paper',
    'fas fa-hand-peace',
    'fas fa-hand-point-down',
    'fas fa-hand-point-left',
    'fas fa-hand-point-right',
    'fas fa-hand-point-up',
    'fas fa-hand-pointer',
    'fas fa-hand-receiving',
    'fas fa-hand-rock',
    'fas fa-hand-scissors',
    'fas fa-hand-sparkles',
    'fas fa-hand-spock',
    'fas fa-hands',
    'fas fa-hands-heart',
    'fas fa-hands-helping',
    'fas fa-hands-usd',
    'fas fa-hands-wash',
    'fas fa-handshake',
    'fas fa-handshake-alt',
    'fas fa-handshake-alt-slash',
    'fas fa-handshake-slash',
    'fas fa-hanukiah',
    'fas fa-hard-hat',
    'fas fa-hashtag',
    'fas fa-hat-chef',
    'fas fa-hat-cowboy',
    'fas fa-hat-cowboy-side',
    'fas fa-hat-santa',
    'fas fa-hat-winter',
    'fas fa-hat-witch',
    'fas fa-hat-wizard',
    'fas fa-hdd',
    'fas fa-head-side',
    'fas fa-head-side-brain',
    'fas fa-head-side-cough',
    'fas fa-head-side-cough-slash',
    'fas fa-head-side-headphones',
    'fas fa-head-side-mask',
    'fas fa-head-side-medical',
    'fas fa-head-side-virus',
    'fas fa-head-vr',
    'fas fa-heading',
    'fas fa-headphones',
    'fas fa-headphones-alt',
    'fas fa-headset',
    'fas fa-heart',
    'fas fa-heart-broken',
    'fas fa-heart-circle',
    'fas fa-heart-rate',
    'fas fa-heart-square',
    'fas fa-heartbeat',
    'fas fa-heat',
    'fas fa-helicopter',
    'fas fa-helmet-battle',
    'fas fa-hexagon',
    'fas fa-highlighter',
    'fas fa-hiking',
    'fas fa-hippo',
    'fas fa-history',
    'fas fa-hockey-mask',
    'fas fa-hockey-puck',
    'fas fa-hockey-sticks',
    'fas fa-holly-berry',
    'fas fa-home',
    'fas fa-home-alt',
    'fas fa-home-heart',
    'fas fa-home-lg',
    'fas fa-home-lg-alt',
    'fas fa-hood-cloak',
    'fas fa-horizontal-rule',
    'fas fa-horse',
    'fas fa-horse-head',
    'fas fa-horse-saddle',
    'fas fa-hospital',
    'fas fa-hospital-alt',
    'fas fa-hospital-symbol',
    'fas fa-hospital-user',
    'fas fa-hospitals',
    'fas fa-hot-tub',
    'fas fa-hotdog',
    'fas fa-hotel',
    'fas fa-hourglass',
    'fas fa-hourglass-end',
    'fas fa-hourglass-half',
    'fas fa-hourglass-start',
    'fas fa-house',
    'fas fa-house-damage',
    'fas fa-house-day',
    'fas fa-house-flood',
    'fas fa-house-leave',
    'fas fa-house-night',
    'fas fa-house-return',
    'fas fa-house-signal',
    'fas fa-house-user',
    'fas fa-hryvnia',
    'fas fa-humidity',
    'fas fa-hurricane',
    'fas fa-i-cursor',
    'fas fa-ice-cream',
    'fas fa-ice-skate',
    'fas fa-icicles',
    'fas fa-icons',
    'fas fa-icons-alt',
    'fas fa-id-badge',
    'fas fa-id-card',
    'fas fa-id-card-alt',
    'fas fa-igloo',
    'fas fa-image',
    'fas fa-image-polaroid',
    'fas fa-images',
    'fas fa-inbox',
    'fas fa-inbox-in',
    'fas fa-inbox-out',
    'fas fa-indent',
    'fas fa-industry',
    'fas fa-industry-alt',
    'fas fa-infinity',
    'fas fa-info',
    'fas fa-info-circle',
    'fas fa-info-square',
    'fas fa-inhaler',
    'fas fa-integral',
    'fas fa-intersection',
    'fas fa-inventory',
    'fas fa-island-tropical',
    'fas fa-italic',
    'fas fa-jack-o-lantern',
    'fas fa-jedi',
    'fas fa-joint',
    'fas fa-journal-whills',
    'fas fa-joystick',
    'fas fa-jug',
    'fas fa-kaaba',
    'fas fa-kazoo',
    'fas fa-kerning',
    'fas fa-key',
    'fas fa-key-skeleton',
    'fas fa-keyboard',
    'fas fa-keynote',
    'fas fa-khanda',
    'fas fa-kidneys',
    'fas fa-kiss',
    'fas fa-kiss-beam',
    'fas fa-kiss-wink-heart',
    'fas fa-kite',
    'fas fa-kiwi-bird',
    'fas fa-knife-kitchen',
    'fas fa-lambda',
    'fas fa-lamp',
    'fas fa-lamp-desk',
    'fas fa-lamp-floor',
    'fas fa-landmark',
    'fas fa-landmark-alt',
    'fas fa-language',
    'fas fa-laptop',
    'fas fa-laptop-code',
    'fas fa-laptop-house',
    'fas fa-laptop-medical',
    'fas fa-lasso',
    'fas fa-laugh',
    'fas fa-laugh-beam',
    'fas fa-laugh-squint',
    'fas fa-laugh-wink',
    'fas fa-layer-group',
    'fas fa-layer-minus',
    'fas fa-layer-plus',
    'fas fa-leaf',
    'fas fa-leaf-heart',
    'fas fa-leaf-maple',
    'fas fa-leaf-oak',
    'fas fa-lemon',
    'fas fa-less-than',
    'fas fa-less-than-equal',
    'fas fa-level-down',
    'fas fa-level-down-alt',
    'fas fa-level-up',
    'fas fa-level-up-alt',
    'fas fa-life-ring',
    'fas fa-light-ceiling',
    'fas fa-light-switch',
    'fas fa-light-switch-off',
    'fas fa-light-switch-on',
    'fas fa-lightbulb',
    'fas fa-lightbulb-dollar',
    'fas fa-lightbulb-exclamation',
    'fas fa-lightbulb-on',
    'fas fa-lightbulb-slash',
    'fas fa-lights-holiday',
    'fas fa-line-columns',
    'fas fa-line-height',
    'fas fa-link',
    'fas fa-lips',
    'fas fa-lira-sign',
    'fas fa-list',
    'fas fa-list-alt',
    'fas fa-list-music',
    'fas fa-list-ol',
    'fas fa-list-ul',
    'fas fa-location',
    'fas fa-location-arrow',
    'fas fa-location-circle',
    'fas fa-location-slash',
    'fas fa-lock',
    'fas fa-lock-alt',
    'fas fa-lock-open',
    'fas fa-lock-open-alt',
    'fas fa-long-arrow-alt-down',
    'fas fa-long-arrow-alt-left',
    'fas fa-long-arrow-alt-right',
    'fas fa-long-arrow-alt-up',
    'fas fa-long-arrow-down',
    'fas fa-long-arrow-left',
    'fas fa-long-arrow-right',
    'fas fa-long-arrow-up',
    'fas fa-loveseat',
    'fas fa-low-vision',
    'fas fa-luchador',
    'fas fa-luggage-cart',
    'fas fa-lungs',
    'fas fa-lungs-virus',
    'fas fa-mace',
    'fas fa-magic',
    'fas fa-magnet',
    'fas fa-mail-bulk',
    'fas fa-mailbox',
    'fas fa-male',
    'fas fa-mandolin',
    'fas fa-map',
    'fas fa-map-marked',
    'fas fa-map-marked-alt',
    'fas fa-map-marker',
    'fas fa-map-marker-alt',
    'fas fa-map-marker-alt-slash',
    'fas fa-map-marker-check',
    'fas fa-map-marker-edit',
    'fas fa-map-marker-exclamation',
    'fas fa-map-marker-minus',
    'fas fa-map-marker-plus',
    'fas fa-map-marker-question',
    'fas fa-map-marker-slash',
    'fas fa-map-marker-smile',
    'fas fa-map-marker-times',
    'fas fa-map-pin',
    'fas fa-map-signs',
    'fas fa-marker',
    'fas fa-mars',
    'fas fa-mars-double',
    'fas fa-mars-stroke',
    'fas fa-mars-stroke-h',
    'fas fa-mars-stroke-v',
    'fas fa-mask',
    'fas fa-meat',
    'fas fa-medal',
    'fas fa-medkit',
    'fas fa-megaphone',
    'fas fa-meh',
    'fas fa-meh-blank',
    'fas fa-meh-rolling-eyes',
    'fas fa-memory',
    'fas fa-menorah',
    'fas fa-mercury',
    'fas fa-meteor',
    'fas fa-microchip',
    'fas fa-microphone',
    'fas fa-microphone-alt',
    'fas fa-microphone-alt-slash',
    'fas fa-microphone-slash',
    'fas fa-microphone-stand',
    'fas fa-microscope',
    'fas fa-microwave',
    'fas fa-mind-share',
    'fas fa-minus',
    'fas fa-minus-circle',
    'fas fa-minus-hexagon',
    'fas fa-minus-octagon',
    'fas fa-minus-square',
    'fas fa-mistletoe',
    'fas fa-mitten',
    'fas fa-mobile',
    'fas fa-mobile-alt',
    'fas fa-mobile-android',
    'fas fa-mobile-android-alt',
    'fas fa-money-bill',
    'fas fa-money-bill-alt',
    'fas fa-money-bill-wave',
    'fas fa-money-bill-wave-alt',
    'fas fa-money-check',
    'fas fa-money-check-alt',
    'fas fa-money-check-edit',
    'fas fa-money-check-edit-alt',
    'fas fa-monitor-heart-rate',
    'fas fa-monkey',
    'fas fa-monument',
    'fas fa-moon',
    'fas fa-moon-cloud',
    'fas fa-moon-stars',
    'fas fa-mortar-pestle',
    'fas fa-mosque',
    'fas fa-motorcycle',
    'fas fa-mountain',
    'fas fa-mountains',
    'fas fa-mouse',
    'fas fa-mouse-alt',
    'fas fa-mouse-pointer',
    'fas fa-mp3-player',
    'fas fa-mug',
    'fas fa-mug-hot',
    'fas fa-mug-marshmallows',
    'fas fa-mug-tea',
    'fas fa-music',
    'fas fa-music-alt',
    'fas fa-music-alt-slash',
    'fas fa-music-slash',
    'fas fa-narwhal',
    'fas fa-network-wired',
    'fas fa-neuter',
    'fas fa-newspaper',
    'fas fa-not-equal',
    'fas fa-notes-medical',
    'fas fa-object-group',
    'fas fa-object-ungroup',
    'fas fa-octagon',
    'fas fa-oil-can',
    'fas fa-oil-temp',
    'fas fa-om',
    'fas fa-omega',
    'fas fa-ornament',
    'fas fa-otter',
    'fas fa-outdent',
    'fas fa-outlet',
    'fas fa-oven',
    'fas fa-overline',
    'fas fa-page-break',
    'fas fa-pager',
    'fas fa-paint-brush',
    'fas fa-paint-brush-alt',
    'fas fa-paint-roller',
    'fas fa-palette',
    'fas fa-pallet',
    'fas fa-pallet-alt',
    'fas fa-paper-plane',
    'fas fa-paperclip',
    'fas fa-parachute-box',
    'fas fa-paragraph',
    'fas fa-paragraph-rtl',
    'fas fa-parking',
    'fas fa-parking-circle',
    'fas fa-parking-circle-slash',
    'fas fa-parking-slash',
    'fas fa-passport',
    'fas fa-pastafarianism',
    'fas fa-paste',
    'fas fa-pause',
    'fas fa-pause-circle',
    'fas fa-paw',
    'fas fa-paw-alt',
    'fas fa-paw-claws',
    'fas fa-peace',
    'fas fa-pegasus',
    'fas fa-pen',
    'fas fa-pen-alt',
    'fas fa-pen-fancy',
    'fas fa-pen-nib',
    'fas fa-pen-square',
    'fas fa-pencil',
    'fas fa-pencil-alt',
    'fas fa-pencil-paintbrush',
    'fas fa-pencil-ruler',
    'fas fa-pennant',
    'fas fa-people-arrows',
    'fas fa-people-carry',
    'fas fa-pepper-hot',
    'fas fa-percent',
    'fas fa-percentage',
    'fas fa-person-booth',
    'fas fa-person-carry',
    'fas fa-person-dolly',
    'fas fa-person-dolly-empty',
    'fas fa-person-sign',
    'fas fa-phone',
    'fas fa-phone-alt',
    'fas fa-phone-laptop',
    'fas fa-phone-office',
    'fas fa-phone-plus',
    'fas fa-phone-rotary',
    'fas fa-phone-slash',
    'fas fa-phone-square',
    'fas fa-phone-square-alt',
    'fas fa-phone-volume',
    'fas fa-photo-video',
    'fas fa-pi',
    'fas fa-piano',
    'fas fa-piano-keyboard',
    'fas fa-pie',
    'fas fa-pig',
    'fas fa-piggy-bank',
    'fas fa-pills',
    'fas fa-pizza',
    'fas fa-pizza-slice',
    'fas fa-place-of-worship',
    'fas fa-plane',
    'fas fa-plane-alt',
    'fas fa-plane-arrival',
    'fas fa-plane-departure',
    'fas fa-plane-slash',
    'fas fa-planet-moon',
    'fas fa-planet-ringed',
    'fas fa-play',
    'fas fa-play-circle',
    'fas fa-plug',
    'fas fa-plus',
    'fas fa-plus-circle',
    'fas fa-plus-hexagon',
    'fas fa-plus-octagon',
    'fas fa-plus-square',
    'fas fa-podcast',
    'fas fa-podium',
    'fas fa-podium-star',
    'fas fa-police-box',
    'fas fa-poll',
    'fas fa-poll-h',
    'fas fa-poll-people',
    'fas fa-poo',
    'fas fa-poo-storm',
    'fas fa-poop',
    'fas fa-popcorn',
    'fas fa-portal-enter',
    'fas fa-portal-exit',
    'fas fa-portrait',
    'fas fa-pound-sign',
    'fas fa-power-off',
    'fas fa-pray',
    'fas fa-praying-hands',
    'fas fa-prescription',
    'fas fa-prescription-bottle',
    'fas fa-prescription-bottle-alt',
    'fas fa-presentation',
    'fas fa-print',
    'fas fa-print-search',
    'fas fa-print-slash',
    'fas fa-procedures',
    'fas fa-project-diagram',
    'fas fa-projector',
    'fas fa-pump-medical',
    'fas fa-pump-soap',
    'fas fa-pumpkin',
    'fas fa-puzzle-piece',
    'fas fa-qrcode',
    'fas fa-question',
    'fas fa-question-circle',
    'fas fa-question-square',
    'fas fa-quidditch',
    'fas fa-quote-left',
    'fas fa-quote-right',
    'fas fa-quran',
    'fas fa-rabbit',
    'fas fa-rabbit-fast',
    'fas fa-racquet',
    'fas fa-radar',
    'fas fa-radiation',
    'fas fa-radiation-alt',
    'fas fa-radio',
    'fas fa-radio-alt',
    'fas fa-rainbow',
    'fas fa-raindrops',
    'fas fa-ram',
    'fas fa-ramp-loading',
    'fas fa-random',
    'fas fa-raygun',
    'fas fa-receipt',
    'fas fa-record-vinyl',
    'fas fa-rectangle-landscape',
    'fas fa-rectangle-portrait',
    'fas fa-rectangle-wide',
    'fas fa-recycle',
    'fas fa-redo',
    'fas fa-redo-alt',
    'fas fa-refrigerator',
    'fas fa-registered',
    'fas fa-remove-format',
    'fas fa-repeat',
    'fas fa-repeat-1',
    'fas fa-repeat-1-alt',
    'fas fa-repeat-alt',
    'fas fa-reply',
    'fas fa-reply-all',
    'fas fa-republican',
    'fas fa-restroom',
    'fas fa-retweet',
    'fas fa-retweet-alt',
    'fas fa-ribbon',
    'fas fa-ring',
    'fas fa-rings-wedding',
    'fas fa-road',
    'fas fa-robot',
    'fas fa-rocket',
    'fas fa-rocket-launch',
    'fas fa-route',
    'fas fa-route-highway',
    'fas fa-route-interstate',
    'fas fa-router',
    'fas fa-rss',
    'fas fa-rss-square',
    'fas fa-ruble-sign',
    'fas fa-ruler',
    'fas fa-ruler-combined',
    'fas fa-ruler-horizontal',
    'fas fa-ruler-triangle',
    'fas fa-ruler-vertical',
    'fas fa-running',
    'fas fa-rupee-sign',
    'fas fa-rv',
    'fas fa-sack',
    'fas fa-sack-dollar',
    'fas fa-sad-cry',
    'fas fa-sad-tear',
    'fas fa-salad',
    'fas fa-sandwich',
    'fas fa-satellite',
    'fas fa-satellite-dish',
    'fas fa-sausage',
    'fas fa-save',
    'fas fa-sax-hot',
    'fas fa-saxophone',
    'fas fa-scalpel',
    'fas fa-scalpel-path',
    'fas fa-scanner',
    'fas fa-scanner-image',
    'fas fa-scanner-keyboard',
    'fas fa-scanner-touchscreen',
    'fas fa-scarecrow',
    'fas fa-scarf',
    'fas fa-school',
    'fas fa-screwdriver',
    'fas fa-scroll',
    'fas fa-scroll-old',
    'fas fa-scrubber',
    'fas fa-scythe',
    'fas fa-sd-card',
    'fas fa-search',
    'fas fa-search-dollar',
    'fas fa-search-location',
    'fas fa-search-minus',
    'fas fa-search-plus',
    'fas fa-seedling',
    'fas fa-send-back',
    'fas fa-send-backward',
    'fas fa-sensor',
    'fas fa-sensor-alert',
    'fas fa-sensor-fire',
    'fas fa-sensor-on',
    'fas fa-sensor-smoke',
    'fas fa-server',
    'fas fa-shapes',
    'fas fa-share',
    'fas fa-share-all',
    'fas fa-share-alt',
    'fas fa-share-alt-square',
    'fas fa-share-square',
    'fas fa-sheep',
    'fas fa-shekel-sign',
    'fas fa-shield',
    'fas fa-shield-alt',
    'fas fa-shield-check',
    'fas fa-shield-cross',
    'fas fa-shield-virus',
    'fas fa-ship',
    'fas fa-shipping-fast',
    'fas fa-shipping-timed',
    'fas fa-shish-kebab',
    'fas fa-shoe-prints',
    'fas fa-shopping-bag',
    'fas fa-shopping-basket',
    'fas fa-shopping-cart',
    'fas fa-shovel',
    'fas fa-shovel-snow',
    'fas fa-shower',
    'fas fa-shredder',
    'fas fa-shuttle-van',
    'fas fa-shuttlecock',
    'fas fa-sickle',
    'fas fa-sigma',
    'fas fa-sign',
    'fas fa-sign-in',
    'fas fa-sign-in-alt',
    'fas fa-sign-language',
    'fas fa-sign-out',
    'fas fa-sign-out-alt',
    'fas fa-signal',
    'fas fa-signal-1',
    'fas fa-signal-2',
    'fas fa-signal-3',
    'fas fa-signal-4',
    'fas fa-signal-alt',
    'fas fa-signal-alt-1',
    'fas fa-signal-alt-2',
    'fas fa-signal-alt-3',
    'fas fa-signal-alt-slash',
    'fas fa-signal-slash',
    'fas fa-signal-stream',
    'fas fa-signature',
    'fas fa-sim-card',
    'fas fa-sink',
    'fas fa-siren',
    'fas fa-siren-on',
    'fas fa-sitemap',
    'fas fa-skating',
    'fas fa-skeleton',
    'fas fa-ski-jump',
    'fas fa-ski-lift',
    'fas fa-skiing',
    'fas fa-skiing-nordic',
    'fas fa-skull',
    'fas fa-skull-cow',
    'fas fa-skull-crossbones',
    'fas fa-slash',
    'fas fa-sledding',
    'fas fa-sleigh',
    'fas fa-sliders-h',
    'fas fa-sliders-h-square',
    'fas fa-sliders-v',
    'fas fa-sliders-v-square',
    'fas fa-smile',
    'fas fa-smile-beam',
    'fas fa-smile-plus',
    'fas fa-smile-wink',
    'fas fa-smog',
    'fas fa-smoke',
    'fas fa-smoking',
    'fas fa-smoking-ban',
    'fas fa-sms',
    'fas fa-snake',
    'fas fa-snooze',
    'fas fa-snow-blowing',
    'fas fa-snowboarding',
    'fas fa-snowflake',
    'fas fa-snowflakes',
    'fas fa-snowman',
    'fas fa-snowmobile',
    'fas fa-snowplow',
    'fas fa-soap',
    'fas fa-socks',
    'fas fa-solar-panel',
    'fas fa-solar-system',
    'fas fa-sort',
    'fas fa-sort-alpha-down',
    'fas fa-sort-alpha-down-alt',
    'fas fa-sort-alpha-up',
    'fas fa-sort-alpha-up-alt',
    'fas fa-sort-alt',
    'fas fa-sort-amount-down',
    'fas fa-sort-amount-down-alt',
    'fas fa-sort-amount-up',
    'fas fa-sort-amount-up-alt',
    'fas fa-sort-circle',
    'fas fa-sort-circle-down',
    'fas fa-sort-circle-up',
    'fas fa-sort-down',
    'fas fa-sort-numeric-down',
    'fas fa-sort-numeric-down-alt',
    'fas fa-sort-numeric-up',
    'fas fa-sort-numeric-up-alt',
    'fas fa-sort-shapes-down',
    'fas fa-sort-shapes-down-alt',
    'fas fa-sort-shapes-up',
    'fas fa-sort-shapes-up-alt',
    'fas fa-sort-size-down',
    'fas fa-sort-size-down-alt',
    'fas fa-sort-size-up',
    'fas fa-sort-size-up-alt',
    'fas fa-sort-up',
    'fas fa-soup',
    'fas fa-spa',
    'fas fa-space-shuttle',
    'fas fa-space-station-moon',
    'fas fa-space-station-moon-alt',
    'fas fa-spade',
    'fas fa-sparkles',
    'fas fa-speaker',
    'fas fa-speakers',
    'fas fa-spell-check',
    'fas fa-spider',
    'fas fa-spider-black-widow',
    'fas fa-spider-web',
    'fas fa-spinner',
    'fas fa-spinner-third',
    'fas fa-splotch',
    'fas fa-spray-can',
    'fas fa-sprinkler',
    'fas fa-square',
    'fas fa-square-full',
    'fas fa-square-root',
    'fas fa-square-root-alt',
    'fas fa-squirrel',
    'fas fa-staff',
    'fas fa-stamp',
    'fas fa-star',
    'fas fa-star-and-crescent',
    'fas fa-star-christmas',
    'fas fa-star-exclamation',
    'fas fa-star-half',
    'fas fa-star-half-alt',
    'fas fa-star-of-david',
    'fas fa-star-of-life',
    'fas fa-star-shooting',
    'fas fa-starfighter',
    'fas fa-starfighter-alt',
    'fas fa-stars',
    'fas fa-starship',
    'fas fa-starship-freighter',
    'fas fa-steak',
    'fas fa-steering-wheel',
    'fas fa-step-backward',
    'fas fa-step-forward',
    'fas fa-stethoscope',
    'fas fa-sticky-note',
    'fas fa-stocking',
    'fas fa-stomach',
    'fas fa-stop',
    'fas fa-stop-circle',
    'fas fa-stopwatch',
    'fas fa-stopwatch-20',
    'fas fa-store',
    'fas fa-store-alt',
    'fas fa-store-alt-slash',
    'fas fa-store-slash',
    'fas fa-stream',
    'fas fa-street-view',
    'fas fa-stretcher',
    'fas fa-strikethrough',
    'fas fa-stroopwafel',
    'fas fa-subscript',
    'fas fa-subway',
    'fas fa-suitcase',
    'fas fa-suitcase-rolling',
    'fas fa-sun',
    'fas fa-sun-cloud',
    'fas fa-sun-dust',
    'fas fa-sun-haze',
    'fas fa-sunglasses',
    'fas fa-sunrise',
    'fas fa-sunset',
    'fas fa-superscript',
    'fas fa-surprise',
    'fas fa-swatchbook',
    'fas fa-swimmer',
    'fas fa-swimming-pool',
    'fas fa-sword',
    'fas fa-sword-laser',
    'fas fa-sword-laser-alt',
    'fas fa-swords',
    'fas fa-swords-laser',
    'fas fa-synagogue',
    'fas fa-sync',
    'fas fa-sync-alt',
    'fas fa-syringe',
    'fas fa-table',
    'fas fa-table-tennis',
    'fas fa-tablet',
    'fas fa-tablet-alt',
    'fas fa-tablet-android',
    'fas fa-tablet-android-alt',
    'fas fa-tablet-rugged',
    'fas fa-tablets',
    'fas fa-tachometer',
    'fas fa-tachometer-alt',
    'fas fa-tachometer-alt-average',
    'fas fa-tachometer-alt-fast',
    'fas fa-tachometer-alt-fastest',
    'fas fa-tachometer-alt-slow',
    'fas fa-tachometer-alt-slowest',
    'fas fa-tachometer-average',
    'fas fa-tachometer-fast',
    'fas fa-tachometer-fastest',
    'fas fa-tachometer-slow',
    'fas fa-tachometer-slowest',
    'fas fa-taco',
    'fas fa-tag',
    'fas fa-tags',
    'fas fa-tally',
    'fas fa-tanakh',
    'fas fa-tape',
    'fas fa-tasks',
    'fas fa-tasks-alt',
    'fas fa-taxi',
    'fas fa-teeth',
    'fas fa-teeth-open',
    'fas fa-telescope',
    'fas fa-temperature-down',
    'fas fa-temperature-frigid',
    'fas fa-temperature-high',
    'fas fa-temperature-hot',
    'fas fa-temperature-low',
    'fas fa-temperature-up',
    'fas fa-tenge',
    'fas fa-tennis-ball',
    'fas fa-terminal',
    'fas fa-text',
    'fas fa-text-height',
    'fas fa-text-size',
    'fas fa-text-width',
    'fas fa-th',
    'fas fa-th-large',
    'fas fa-th-list',
    'fas fa-theater-masks',
    'fas fa-thermometer',
    'fas fa-thermometer-empty',
    'fas fa-thermometer-full',
    'fas fa-thermometer-half',
    'fas fa-thermometer-quarter',
    'fas fa-thermometer-three-quarters',
    'fas fa-theta',
    'fas fa-thumbs-down',
    'fas fa-thumbs-up',
    'fas fa-thumbtack',
    'fas fa-thunderstorm',
    'fas fa-thunderstorm-moon',
    'fas fa-thunderstorm-sun',
    'fas fa-ticket',
    'fas fa-ticket-alt',
    'fas fa-tilde',
    'fas fa-times',
    'fas fa-times-circle',
    'fas fa-times-hexagon',
    'fas fa-times-octagon',
    'fas fa-times-square',
    'fas fa-tint',
    'fas fa-tint-slash',
    'fas fa-tire',
    'fas fa-tire-flat',
    'fas fa-tire-pressure-warning',
    'fas fa-tire-rugged',
    'fas fa-tired',
    'fas fa-toggle-off',
    'fas fa-toggle-on',
    'fas fa-toilet',
    'fas fa-toilet-paper',
    'fas fa-toilet-paper-alt',
    'fas fa-toilet-paper-slash',
    'fas fa-tombstone',
    'fas fa-tombstone-alt',
    'fas fa-toolbox',
    'fas fa-tools',
    'fas fa-tooth',
    'fas fa-toothbrush',
    'fas fa-torah',
    'fas fa-torii-gate',
    'fas fa-tornado',
    'fas fa-tractor',
    'fas fa-trademark',
    'fas fa-traffic-cone',
    'fas fa-traffic-light',
    'fas fa-traffic-light-go',
    'fas fa-traffic-light-slow',
    'fas fa-traffic-light-stop',
    'fas fa-trailer',
    'fas fa-train',
    'fas fa-tram',
    'fas fa-transgender',
    'fas fa-transgender-alt',
    'fas fa-transporter',
    'fas fa-transporter-1',
    'fas fa-transporter-2',
    'fas fa-transporter-3',
    'fas fa-transporter-empty',
    'fas fa-trash',
    'fas fa-trash-alt',
    'fas fa-trash-restore',
    'fas fa-trash-restore-alt',
    'fas fa-trash-undo',
    'fas fa-trash-undo-alt',
    'fas fa-treasure-chest',
    'fas fa-tree',
    'fas fa-tree-alt',
    'fas fa-tree-christmas',
    'fas fa-tree-decorated',
    'fas fa-tree-large',
    'fas fa-tree-palm',
    'fas fa-trees',
    'fas fa-triangle',
    'fas fa-triangle-music',
    'fas fa-trophy',
    'fas fa-trophy-alt',
    'fas fa-truck',
    'fas fa-truck-container',
    'fas fa-truck-couch',
    'fas fa-truck-loading',
    'fas fa-truck-monster',
    'fas fa-truck-moving',
    'fas fa-truck-pickup',
    'fas fa-truck-plow',
    'fas fa-truck-ramp',
    'fas fa-trumpet',
    'fas fa-tshirt',
    'fas fa-tty',
    'fas fa-turkey',
    'fas fa-turntable',
    'fas fa-turtle',
    'fas fa-tv',
    'fas fa-tv-alt',
    'fas fa-tv-music',
    'fas fa-tv-retro',
    'fas fa-typewriter',
    'fas fa-ufo',
    'fas fa-ufo-beam',
    'fas fa-umbrella',
    'fas fa-umbrella-beach',
    'fas fa-underline',
    'fas fa-undo',
    'fas fa-undo-alt',
    'fas fa-unicorn',
    'fas fa-union',
    'fas fa-universal-access',
    'fas fa-university',
    'fas fa-unlink',
    'fas fa-unlock',
    'fas fa-unlock-alt',
    'fas fa-upload',
    'fas fa-usb-drive',
    'fas fa-usd-circle',
    'fas fa-usd-square',
    'fas fa-user',
    'fas fa-user-alien',
    'fas fa-user-alt',
    'fas fa-user-alt-slash',
    'fas fa-user-astronaut',
    'fas fa-user-chart',
    'fas fa-user-check',
    'fas fa-user-circle',
    'fas fa-user-clock',
    'fas fa-user-cog',
    'fas fa-user-cowboy',
    'fas fa-user-crown',
    'fas fa-user-edit',
    'fas fa-user-friends',
    'fas fa-user-graduate',
    'fas fa-user-hard-hat',
    'fas fa-user-headset',
    'fas fa-user-injured',
    'fas fa-user-lock',
    'fas fa-user-md',
    'fas fa-user-md-chat',
    'fas fa-user-minus',
    'fas fa-user-music',
    'fas fa-user-ninja',
    'fas fa-user-nurse',
    'fas fa-user-plus',
    'fas fa-user-robot',
    'fas fa-user-secret',
    'fas fa-user-shield',
    'fas fa-user-slash',
    'fas fa-user-tag',
    'fas fa-user-tie',
    'fas fa-user-times',
    'fas fa-user-unlock',
    'fas fa-user-visor',
    'fas fa-users',
    'fas fa-users-class',
    'fas fa-users-cog',
    'fas fa-users-crown',
    'fas fa-users-medical',
    'fas fa-users-slash',
    'fas fa-utensil-fork',
    'fas fa-utensil-knife',
    'fas fa-utensil-spoon',
    'fas fa-utensils',
    'fas fa-utensils-alt',
    'fas fa-vacuum',
    'fas fa-vacuum-robot',
    'fas fa-value-absolute',
    'fas fa-vector-square',
    'fas fa-venus',
    'fas fa-venus-double',
    'fas fa-venus-mars',
    'fas fa-vest',
    'fas fa-vest-patches',
    'fas fa-vhs',
    'fas fa-vial',
    'fas fa-vials',
    'fas fa-video',
    'fas fa-video-plus',
    'fas fa-video-slash',
    'fas fa-vihara',
    'fas fa-violin',
    'fas fa-virus',
    'fas fa-virus-slash',
    'fas fa-viruses',
    'fas fa-voicemail',
    'fas fa-volcano',
    'fas fa-volleyball-ball',
    'fas fa-volume',
    'fas fa-volume-down',
    'fas fa-volume-mute',
    'fas fa-volume-off',
    'fas fa-volume-slash',
    'fas fa-volume-up',
    'fas fa-vote-nay',
    'fas fa-vote-yea',
    'fas fa-vr-cardboard',
    'fas fa-wagon-covered',
    'fas fa-walker',
    'fas fa-walkie-talkie',
    'fas fa-walking',
    'fas fa-wallet',
    'fas fa-wand',
    'fas fa-wand-magic',
    'fas fa-warehouse',
    'fas fa-warehouse-alt',
    'fas fa-washer',
    'fas fa-watch',
    'fas fa-watch-calculator',
    'fas fa-watch-fitness',
    'fas fa-water',
    'fas fa-water-lower',
    'fas fa-water-rise',
    'fas fa-wave-sine',
    'fas fa-wave-square',
    'fas fa-wave-triangle',
    'fas fa-waveform',
    'fas fa-waveform-path',
    'fas fa-webcam',
    'fas fa-webcam-slash',
    'fas fa-weight',
    'fas fa-weight-hanging',
    'fas fa-whale',
    'fas fa-wheat',
    'fas fa-wheelchair',
    'fas fa-whistle',
    'fas fa-wifi',
    'fas fa-wifi-1',
    'fas fa-wifi-2',
    'fas fa-wifi-slash',
    'fas fa-wind',
    'fas fa-wind-turbine',
    'fas fa-wind-warning',
    'fas fa-window',
    'fas fa-window-alt',
    'fas fa-window-close',
    'fas fa-window-frame',
    'fas fa-window-frame-open',
    'fas fa-window-maximize',
    'fas fa-window-minimize',
    'fas fa-window-restore',
    'fas fa-windsock',
    'fas fa-wine-bottle',
    'fas fa-wine-glass',
    'fas fa-wine-glass-alt',
    'fas fa-won-sign',
    'fas fa-wreath',
    'fas fa-wrench',
    'fas fa-x-ray',
    'fas fa-yen-sign',
    'fas fa-yin-yang',
    'fab fa-500px',
    'fab fa-accessible-icon',
    'fab fa-accusoft',
    'fab fa-acquisitions-incorporated',
    'fab fa-adn',
    'fab fa-adversal',
    'fab fa-affiliatetheme',
    'fab fa-airbnb',
    'fab fa-algolia',
    'fab fa-alipay',
    'fab fa-amazon',
    'fab fa-amazon-pay',
    'fab fa-amilia',
    'fab fa-android',
    'fab fa-angellist',
    'fab fa-angrycreative',
    'fab fa-angular',
    'fab fa-app-store',
    'fab fa-app-store-ios',
    'fab fa-apper',
    'fab fa-apple',
    'fab fa-apple-pay',
    'fab fa-artstation',
    'fab fa-asymmetrik',
    'fab fa-atlassian',
    'fab fa-audible',
    'fab fa-autoprefixer',
    'fab fa-avianex',
    'fab fa-aviato',
    'fab fa-aws',
    'fab fa-bandcamp',
    'fab fa-battle-net',
    'fab fa-behance',
    'fab fa-behance-square',
    'fab fa-bimobject',
    'fab fa-bitbucket',
    'fab fa-bitcoin',
    'fab fa-bity',
    'fab fa-black-tie',
    'fab fa-blackberry',
    'fab fa-blogger',
    'fab fa-blogger-b',
    'fab fa-bluetooth',
    'fab fa-bluetooth-b',
    'fab fa-bootstrap',
    'fab fa-btc',
    'fab fa-buffer',
    'fab fa-buromobelexperte',
    'fab fa-buy-n-large',
    'fab fa-buysellads',
    'fab fa-canadian-maple-leaf',
    'fab fa-cc-amazon-pay',
    'fab fa-cc-amex',
    'fab fa-cc-apple-pay',
    'fab fa-cc-diners-club',
    'fab fa-cc-discover',
    'fab fa-cc-jcb',
    'fab fa-cc-mastercard',
    'fab fa-cc-paypal',
    'fab fa-cc-stripe',
    'fab fa-cc-visa',
    'fab fa-centercode',
    'fab fa-centos',
    'fab fa-chrome',
    'fab fa-chromecast',
    'fab fa-cloudflare',
    'fab fa-cloudscale',
    'fab fa-cloudsmith',
    'fab fa-cloudversify',
    'fab fa-codepen',
    'fab fa-codiepie',
    'fab fa-confluence',
    'fab fa-connectdevelop',
    'fab fa-contao',
    'fab fa-cotton-bureau',
    'fab fa-cpanel',
    'fab fa-creative-commons',
    'fab fa-creative-commons-by',
    'fab fa-creative-commons-nc',
    'fab fa-creative-commons-nc-eu',
    'fab fa-creative-commons-nc-jp',
    'fab fa-creative-commons-nd',
    'fab fa-creative-commons-pd',
    'fab fa-creative-commons-pd-alt',
    'fab fa-creative-commons-remix',
    'fab fa-creative-commons-sa',
    'fab fa-creative-commons-sampling',
    'fab fa-creative-commons-sampling-plus',
    'fab fa-creative-commons-share',
    'fab fa-creative-commons-zero',
    'fab fa-critical-role',
    'fab fa-css3',
    'fab fa-css3-alt',
    'fab fa-cuttlefish',
    'fab fa-d-and-d',
    'fab fa-d-and-d-beyond',
    'fab fa-dailymotion',
    'fab fa-dashcube',
    'fab fa-deezer',
    'fab fa-delicious',
    'fab fa-deploydog',
    'fab fa-deskpro',
    'fab fa-dev',
    'fab fa-deviantart',
    'fab fa-dhl',
    'fab fa-diaspora',
    'fab fa-digg',
    'fab fa-digital-ocean',
    'fab fa-discord',
    'fab fa-discourse',
    'fab fa-dochub',
    'fab fa-docker',
    'fab fa-draft2digital',
    'fab fa-dribbble',
    'fab fa-dribbble-square',
    'fab fa-dropbox',
    'fab fa-drupal',
    'fab fa-dyalog',
    'fab fa-earlybirds',
    'fab fa-ebay',
    'fab fa-edge',
    'fab fa-edge-legacy',
    'fab fa-elementor',
    'fab fa-ello',
    'fab fa-ember',
    'fab fa-empire',
    'fab fa-envira',
    'fab fa-erlang',
    'fab fa-ethereum',
    'fab fa-etsy',
    'fab fa-evernote',
    'fab fa-expeditedssl',
    'fab fa-facebook',
    'fab fa-facebook-f',
    'fab fa-facebook-messenger',
    'fab fa-facebook-square',
    'fab fa-fantasy-flight-games',
    'fab fa-fedex',
    'fab fa-fedora',
    'fab fa-figma',
    'fab fa-firefox',
    'fab fa-firefox-browser',
    'fab fa-first-order',
    'fab fa-first-order-alt',
    'fab fa-firstdraft',
    'fab fa-flickr',
    'fab fa-flipboard',
    'fab fa-fly',
    'fab fa-font-awesome',
    'fab fa-font-awesome-alt',
    'fab fa-font-awesome-flag',
    'fab fa-fonticons',
    'fab fa-fonticons-fi',
    'fab fa-fort-awesome',
    'fab fa-fort-awesome-alt',
    'fab fa-forumbee',
    'fab fa-foursquare',
    'fab fa-free-code-camp',
    'fab fa-freebsd',
    'fab fa-fulcrum',
    'fab fa-galactic-republic',
    'fab fa-galactic-senate',
    'fab fa-get-pocket',
    'fab fa-gg',
    'fab fa-gg-circle',
    'fab fa-git',
    'fab fa-git-alt',
    'fab fa-git-square',
    'fab fa-github',
    'fab fa-github-alt',
    'fab fa-github-square',
    'fab fa-gitkraken',
    'fab fa-gitlab',
    'fab fa-gitter',
    'fab fa-glide',
    'fab fa-glide-g',
    'fab fa-gofore',
    'fab fa-goodreads',
    'fab fa-goodreads-g',
    'fab fa-google',
    'fab fa-google-drive',
    'fab fa-google-pay',
    'fab fa-google-play',
    'fab fa-google-plus',
    'fab fa-google-plus-g',
    'fab fa-google-plus-square',
    'fab fa-google-wallet',
    'fab fa-gratipay',
    'fab fa-grav',
    'fab fa-gripfire',
    'fab fa-grunt',
    'fab fa-guilded',
    'fab fa-gulp',
    'fab fa-hacker-news',
    'fab fa-hacker-news-square',
    'fab fa-hackerrank',
    'fab fa-hips',
    'fab fa-hire-a-helper',
    'fab fa-hive',
    'fab fa-hooli',
    'fab fa-hornbill',
    'fab fa-hotjar',
    'fab fa-houzz',
    'fab fa-html5',
    'fab fa-hubspot',
    'fab fa-ideal',
    'fab fa-imdb',
    'fab fa-innosoft',
    'fab fa-instagram',
    'fab fa-instagram-square',
    'fab fa-instalod',
    'fab fa-intercom',
    'fab fa-internet-explorer',
    'fab fa-invision',
    'fab fa-ioxhost',
    'fab fa-itch-io',
    'fab fa-itunes',
    'fab fa-itunes-note',
    'fab fa-java',
    'fab fa-jedi-order',
    'fab fa-jenkins',
    'fab fa-jira',
    'fab fa-joget',
    'fab fa-joomla',
    'fab fa-js',
    'fab fa-js-square',
    'fab fa-jsfiddle',
    'fab fa-kaggle',
    'fab fa-keybase',
    'fab fa-keycdn',
    'fab fa-kickstarter',
    'fab fa-kickstarter-k',
    'fab fa-korvue',
    'fab fa-laravel',
    'fab fa-lastfm',
    'fab fa-lastfm-square',
    'fab fa-leanpub',
    'fab fa-less',
    'fab fa-line',
    'fab fa-linkedin',
    'fab fa-linkedin-in',
    'fab fa-linode',
    'fab fa-linux',
    'fab fa-lyft',
    'fab fa-magento',
    'fab fa-mailchimp',
    'fab fa-mandalorian',
    'fab fa-markdown',
    'fab fa-mastodon',
    'fab fa-maxcdn',
    'fab fa-mdb',
    'fab fa-medapps',
    'fab fa-medium',
    'fab fa-medium-m',
    'fab fa-medrt',
    'fab fa-meetup',
    'fab fa-megaport',
    'fab fa-mendeley',
    'fab fa-microblog',
    'fab fa-microsoft',
    'fab fa-mix',
    'fab fa-mixcloud',
    'fab fa-mixer',
    'fab fa-mizuni',
    'fab fa-modx',
    'fab fa-monero',
    'fab fa-napster',
    'fab fa-neos',
    'fab fa-nimblr',
    'fab fa-node',
    'fab fa-node-js',
    'fab fa-npm',
    'fab fa-ns8',
    'fab fa-nutritionix',
    'fab fa-octopus-deploy',
    'fab fa-odnoklassniki',
    'fab fa-odnoklassniki-square',
    'fab fa-old-republic',
    'fab fa-opencart',
    'fab fa-openid',
    'fab fa-opera',
    'fab fa-optin-monster',
    'fab fa-orcid',
    'fab fa-osi',
    'fab fa-page4',
    'fab fa-pagelines',
    'fab fa-palfed',
    'fab fa-patreon',
    'fab fa-paypal',
    'fab fa-penny-arcade',
    'fab fa-perbyte',
    'fab fa-periscope',
    'fab fa-phabricator',
    'fab fa-phoenix-framework',
    'fab fa-phoenix-squadron',
    'fab fa-php',
    'fab fa-pied-piper',
    'fab fa-pied-piper-alt',
    'fab fa-pied-piper-hat',
    'fab fa-pied-piper-pp',
    'fab fa-pied-piper-square',
    'fab fa-pinterest',
    'fab fa-pinterest-p',
    'fab fa-pinterest-square',
    'fab fa-playstation',
    'fab fa-product-hunt',
    'fab fa-pushed',
    'fab fa-python',
    'fab fa-qq',
    'fab fa-quinscape',
    'fab fa-quora',
    'fab fa-r-project',
    'fab fa-raspberry-pi',
    'fab fa-ravelry',
    'fab fa-react',
    'fab fa-reacteurope',
    'fab fa-readme',
    'fab fa-rebel',
    'fab fa-red-river',
    'fab fa-reddit',
    'fab fa-reddit-alien',
    'fab fa-reddit-square',
    'fab fa-redhat',
    'fab fa-renren',
    'fab fa-replyd',
    'fab fa-researchgate',
    'fab fa-resolving',
    'fab fa-rev',
    'fab fa-rocketchat',
    'fab fa-rockrms',
    'fab fa-rust',
    'fab fa-safari',
    'fab fa-salesforce',
    'fab fa-sass',
    'fab fa-schlix',
    'fab fa-scribd',
    'fab fa-searchengin',
    'fab fa-sellcast',
    'fab fa-sellsy',
    'fab fa-servicestack',
    'fab fa-shirtsinbulk',
    'fab fa-shopify',
    'fab fa-shopware',
    'fab fa-simplybuilt',
    'fab fa-sistrix',
    'fab fa-sith',
    'fab fa-sketch',
    'fab fa-skyatlas',
    'fab fa-skype',
    'fab fa-slack',
    'fab fa-slack-hash',
    'fab fa-slideshare',
    'fab fa-snapchat',
    'fab fa-snapchat-ghost',
    'fab fa-snapchat-square',
    'fab fa-soundcloud',
    'fab fa-sourcetree',
    'fab fa-speakap',
    'fab fa-speaker-deck',
    'fab fa-spotify',
    'fab fa-squarespace',
    'fab fa-stack-exchange',
    'fab fa-stack-overflow',
    'fab fa-stackpath',
    'fab fa-staylinked',
    'fab fa-steam',
    'fab fa-steam-square',
    'fab fa-steam-symbol',
    'fab fa-sticker-mule',
    'fab fa-strava',
    'fab fa-stripe',
    'fab fa-stripe-s',
    'fab fa-studiovinari',
    'fab fa-stumbleupon',
    'fab fa-stumbleupon-circle',
    'fab fa-superpowers',
    'fab fa-supple',
    'fab fa-suse',
    'fab fa-swift',
    'fab fa-symfony',
    'fab fa-teamspeak',
    'fab fa-telegram',
    'fab fa-telegram-plane',
    'fab fa-tencent-weibo',
    'fab fa-the-red-yeti',
    'fab fa-themeco',
    'fab fa-themeisle',
    'fab fa-think-peaks',
    'fab fa-tiktok',
    'fab fa-trade-federation',
    'fab fa-trello',
    'fab fa-tumblr',
    'fab fa-tumblr-square',
    'fab fa-twitch',
    'fab fa-twitter',
    'fab fa-twitter-square',
    'fab fa-typo3',
    'fab fa-uber',
    'fab fa-ubuntu',
    'fab fa-uikit',
    'fab fa-umbraco',
    'fab fa-uncharted',
    'fab fa-uniregistry',
    'fab fa-unity',
    'fab fa-unsplash',
    'fab fa-untappd',
    'fab fa-ups',
    'fab fa-usb',
    'fab fa-usps',
    'fab fa-ussunnah',
    'fab fa-vaadin',
    'fab fa-viacoin',
    'fab fa-viadeo',
    'fab fa-viadeo-square',
    'fab fa-viber',
    'fab fa-vimeo',
    'fab fa-vimeo-square',
    'fab fa-vimeo-v',
    'fab fa-vine',
    'fab fa-vk',
    'fab fa-vnv',
    'fab fa-vuejs',
    'fab fa-watchman-monitoring',
    'fab fa-waze',
    'fab fa-weebly',
    'fab fa-weibo',
    'fab fa-weixin',
    'fab fa-whatsapp',
    'fab fa-whatsapp-square',
    'fab fa-whmcs',
    'fab fa-wikipedia-w',
    'fab fa-windows',
    'fab fa-wix',
    'fab fa-wizards-of-the-coast',
    'fab fa-wodu',
    'fab fa-wolf-pack-battalion',
    'fab fa-wordpress',
    'fab fa-wordpress-simple',
    'fab fa-wpbeginner',
    'fab fa-wpexplorer',
    'fab fa-wpforms',
    'fab fa-wpressr',
    'fab fa-xbox',
    'fab fa-xing',
    'fab fa-xing-square',
    'fab fa-y-combinator',
    'fab fa-yahoo',
    'fab fa-yammer',
    'fab fa-yandex',
    'fab fa-yandex-international',
    'fab fa-yarn',
    'fab fa-yelp',
    'fab fa-yoast',
    'fab fa-youtube',
    'fab fa-youtube-square',
    'fab fa-zhihu',
    'far fa-abacus',
    'far fa-acorn',
    'far fa-ad',
    'far fa-address-book',
    'far fa-address-card',
    'far fa-adjust',
    'far fa-air-conditioner',
    'far fa-air-freshener',
    'far fa-alarm-clock',
    'far fa-alarm-exclamation',
    'far fa-alarm-plus',
    'far fa-alarm-snooze',
    'far fa-album',
    'far fa-album-collection',
    'far fa-alicorn',
    'far fa-alien',
    'far fa-alien-monster',
    'far fa-align-center',
    'far fa-align-justify',
    'far fa-align-left',
    'far fa-align-right',
    'far fa-align-slash',
    'far fa-allergies',
    'far fa-ambulance',
    'far fa-american-sign-language-interpreting',
    'far fa-amp-guitar',
    'far fa-analytics',
    'far fa-anchor',
    'far fa-angel',
    'far fa-angle-double-down',
    'far fa-angle-double-left',
    'far fa-angle-double-right',
    'far fa-angle-double-up',
    'far fa-angle-down',
    'far fa-angle-left',
    'far fa-angle-right',
    'far fa-angle-up',
    'far fa-angry',
    'far fa-ankh',
    'far fa-apple-alt',
    'far fa-apple-crate',
    'far fa-archive',
    'far fa-archway',
    'far fa-arrow-alt-circle-down',
    'far fa-arrow-alt-circle-left',
    'far fa-arrow-alt-circle-right',
    'far fa-arrow-alt-circle-up',
    'far fa-arrow-alt-down',
    'far fa-arrow-alt-from-bottom',
    'far fa-arrow-alt-from-left',
    'far fa-arrow-alt-from-right',
    'far fa-arrow-alt-from-top',
    'far fa-arrow-alt-left',
    'far fa-arrow-alt-right',
    'far fa-arrow-alt-square-down',
    'far fa-arrow-alt-square-left',
    'far fa-arrow-alt-square-right',
    'far fa-arrow-alt-square-up',
    'far fa-arrow-alt-to-bottom',
    'far fa-arrow-alt-to-left',
    'far fa-arrow-alt-to-right',
    'far fa-arrow-alt-to-top',
    'far fa-arrow-alt-up',
    'far fa-arrow-circle-down',
    'far fa-arrow-circle-left',
    'far fa-arrow-circle-right',
    'far fa-arrow-circle-up',
    'far fa-arrow-down',
    'far fa-arrow-from-bottom',
    'far fa-arrow-from-left',
    'far fa-arrow-from-right',
    'far fa-arrow-from-top',
    'far fa-arrow-left',
    'far fa-arrow-right',
    'far fa-arrow-square-down',
    'far fa-arrow-square-left',
    'far fa-arrow-square-right',
    'far fa-arrow-square-up',
    'far fa-arrow-to-bottom',
    'far fa-arrow-to-left',
    'far fa-arrow-to-right',
    'far fa-arrow-to-top',
    'far fa-arrow-up',
    'far fa-arrows',
    'far fa-arrows-alt',
    'far fa-arrows-alt-h',
    'far fa-arrows-alt-v',
    'far fa-arrows-h',
    'far fa-arrows-v',
    'far fa-assistive-listening-systems',
    'far fa-asterisk',
    'far fa-at',
    'far fa-atlas',
    'far fa-atom',
    'far fa-atom-alt',
    'far fa-audio-description',
    'far fa-award',
    'far fa-axe',
    'far fa-axe-battle',
    'far fa-baby',
    'far fa-baby-carriage',
    'far fa-backpack',
    'far fa-backspace',
    'far fa-backward',
    'far fa-bacon',
    'far fa-bacteria',
    'far fa-bacterium',
    'far fa-badge',
    'far fa-badge-check',
    'far fa-badge-dollar',
    'far fa-badge-percent',
    'far fa-badge-sheriff',
    'far fa-badger-honey',
    'far fa-bags-shopping',
    'far fa-bahai',
    'far fa-balance-scale',
    'far fa-balance-scale-left',
    'far fa-balance-scale-right',
    'far fa-ball-pile',
    'far fa-ballot',
    'far fa-ballot-check',
    'far fa-ban',
    'far fa-band-aid',
    'far fa-banjo',
    'far fa-barcode',
    'far fa-barcode-alt',
    'far fa-barcode-read',
    'far fa-barcode-scan',
    'far fa-bars',
    'far fa-baseball',
    'far fa-baseball-ball',
    'far fa-basketball-ball',
    'far fa-basketball-hoop',
    'far fa-bat',
    'far fa-bath',
    'far fa-battery-bolt',
    'far fa-battery-empty',
    'far fa-battery-full',
    'far fa-battery-half',
    'far fa-battery-quarter',
    'far fa-battery-slash',
    'far fa-battery-three-quarters',
    'far fa-bed',
    'far fa-bed-alt',
    'far fa-bed-bunk',
    'far fa-bed-empty',
    'far fa-beer',
    'far fa-bell',
    'far fa-bell-exclamation',
    'far fa-bell-on',
    'far fa-bell-plus',
    'far fa-bell-school',
    'far fa-bell-school-slash',
    'far fa-bell-slash',
    'far fa-bells',
    'far fa-betamax',
    'far fa-bezier-curve',
    'far fa-bible',
    'far fa-bicycle',
    'far fa-biking',
    'far fa-biking-mountain',
    'far fa-binoculars',
    'far fa-biohazard',
    'far fa-birthday-cake',
    'far fa-blanket',
    'far fa-blender',
    'far fa-blender-phone',
    'far fa-blind',
    'far fa-blinds',
    'far fa-blinds-open',
    'far fa-blinds-raised',
    'far fa-blog',
    'far fa-bold',
    'far fa-bolt',
    'far fa-bomb',
    'far fa-bone',
    'far fa-bone-break',
    'far fa-bong',
    'far fa-book',
    'far fa-book-alt',
    'far fa-book-dead',
    'far fa-book-heart',
    'far fa-book-medical',
    'far fa-book-open',
    'far fa-book-reader',
    'far fa-book-spells',
    'far fa-book-user',
    'far fa-bookmark',
    'far fa-books',
    'far fa-books-medical',
    'far fa-boombox',
    'far fa-boot',
    'far fa-booth-curtain',
    'far fa-border-all',
    'far fa-border-bottom',
    'far fa-border-center-h',
    'far fa-border-center-v',
    'far fa-border-inner',
    'far fa-border-left',
    'far fa-border-none',
    'far fa-border-outer',
    'far fa-border-right',
    'far fa-border-style',
    'far fa-border-style-alt',
    'far fa-border-top',
    'far fa-bow-arrow',
    'far fa-bowling-ball',
    'far fa-bowling-pins',
    'far fa-box',
    'far fa-box-alt',
    'far fa-box-ballot',
    'far fa-box-check',
    'far fa-box-fragile',
    'far fa-box-full',
    'far fa-box-heart',
    'far fa-box-open',
    'far fa-box-tissue',
    'far fa-box-up',
    'far fa-box-usd',
    'far fa-boxes',
    'far fa-boxes-alt',
    'far fa-boxing-glove',
    'far fa-brackets',
    'far fa-brackets-curly',
    'far fa-braille',
    'far fa-brain',
    'far fa-bread-loaf',
    'far fa-bread-slice',
    'far fa-briefcase',
    'far fa-briefcase-medical',
    'far fa-bring-forward',
    'far fa-bring-front',
    'far fa-broadcast-tower',
    'far fa-broom',
    'far fa-browser',
    'far fa-brush',
    'far fa-bug',
    'far fa-building',
    'far fa-bullhorn',
    'far fa-bullseye',
    'far fa-bullseye-arrow',
    'far fa-bullseye-pointer',
    'far fa-burger-soda',
    'far fa-burn',
    'far fa-burrito',
    'far fa-bus',
    'far fa-bus-alt',
    'far fa-bus-school',
    'far fa-business-time',
    'far fa-cabinet-filing',
    'far fa-cactus',
    'far fa-calculator',
    'far fa-calculator-alt',
    'far fa-calendar',
    'far fa-calendar-alt',
    'far fa-calendar-check',
    'far fa-calendar-day',
    'far fa-calendar-edit',
    'far fa-calendar-exclamation',
    'far fa-calendar-minus',
    'far fa-calendar-plus',
    'far fa-calendar-star',
    'far fa-calendar-times',
    'far fa-calendar-week',
    'far fa-camcorder',
    'far fa-camera',
    'far fa-camera-alt',
    'far fa-camera-home',
    'far fa-camera-movie',
    'far fa-camera-polaroid',
    'far fa-camera-retro',
    'far fa-campfire',
    'far fa-campground',
    'far fa-candle-holder',
    'far fa-candy-cane',
    'far fa-candy-corn',
    'far fa-cannabis',
    'far fa-capsules',
    'far fa-car',
    'far fa-car-alt',
    'far fa-car-battery',
    'far fa-car-building',
    'far fa-car-bump',
    'far fa-car-bus',
    'far fa-car-crash',
    'far fa-car-garage',
    'far fa-car-mechanic',
    'far fa-car-side',
    'far fa-car-tilt',
    'far fa-car-wash',
    'far fa-caravan',
    'far fa-caravan-alt',
    'far fa-caret-circle-down',
    'far fa-caret-circle-left',
    'far fa-caret-circle-right',
    'far fa-caret-circle-up',
    'far fa-caret-down',
    'far fa-caret-left',
    'far fa-caret-right',
    'far fa-caret-square-down',
    'far fa-caret-square-left',
    'far fa-caret-square-right',
    'far fa-caret-square-up',
    'far fa-caret-up',
    'far fa-carrot',
    'far fa-cars',
    'far fa-cart-arrow-down',
    'far fa-cart-plus',
    'far fa-cash-register',
    'far fa-cassette-tape',
    'far fa-cat',
    'far fa-cat-space',
    'far fa-cauldron',
    'far fa-cctv',
    'far fa-certificate',
    'far fa-chair',
    'far fa-chair-office',
    'far fa-chalkboard',
    'far fa-chalkboard-teacher',
    'far fa-charging-station',
    'far fa-chart-area',
    'far fa-chart-bar',
    'far fa-chart-line',
    'far fa-chart-line-down',
    'far fa-chart-network',
    'far fa-chart-pie',
    'far fa-chart-pie-alt',
    'far fa-chart-scatter',
    'far fa-check',
    'far fa-check-circle',
    'far fa-check-double',
    'far fa-check-square',
    'far fa-cheese',
    'far fa-cheese-swiss',
    'far fa-cheeseburger',
    'far fa-chess',
    'far fa-chess-bishop',
    'far fa-chess-bishop-alt',
    'far fa-chess-board',
    'far fa-chess-clock',
    'far fa-chess-clock-alt',
    'far fa-chess-king',
    'far fa-chess-king-alt',
    'far fa-chess-knight',
    'far fa-chess-knight-alt',
    'far fa-chess-pawn',
    'far fa-chess-pawn-alt',
    'far fa-chess-queen',
    'far fa-chess-queen-alt',
    'far fa-chess-rook',
    'far fa-chess-rook-alt',
    'far fa-chevron-circle-down',
    'far fa-chevron-circle-left',
    'far fa-chevron-circle-right',
    'far fa-chevron-circle-up',
    'far fa-chevron-double-down',
    'far fa-chevron-double-left',
    'far fa-chevron-double-right',
    'far fa-chevron-double-up',
    'far fa-chevron-down',
    'far fa-chevron-left',
    'far fa-chevron-right',
    'far fa-chevron-square-down',
    'far fa-chevron-square-left',
    'far fa-chevron-square-right',
    'far fa-chevron-square-up',
    'far fa-chevron-up',
    'far fa-child',
    'far fa-chimney',
    'far fa-church',
    'far fa-circle',
    'far fa-circle-notch',
    'far fa-city',
    'far fa-clarinet',
    'far fa-claw-marks',
    'far fa-clinic-medical',
    'far fa-clipboard',
    'far fa-clipboard-check',
    'far fa-clipboard-list',
    'far fa-clipboard-list-check',
    'far fa-clipboard-prescription',
    'far fa-clipboard-user',
    'far fa-clock',
    'far fa-clone',
    'far fa-closed-captioning',
    'far fa-cloud',
    'far fa-cloud-download',
    'far fa-cloud-download-alt',
    'far fa-cloud-drizzle',
    'far fa-cloud-hail',
    'far fa-cloud-hail-mixed',
    'far fa-cloud-meatball',
    'far fa-cloud-moon',
    'far fa-cloud-moon-rain',
    'far fa-cloud-music',
    'far fa-cloud-rain',
    'far fa-cloud-rainbow',
    'far fa-cloud-showers',
    'far fa-cloud-showers-heavy',
    'far fa-cloud-sleet',
    'far fa-cloud-snow',
    'far fa-cloud-sun',
    'far fa-cloud-sun-rain',
    'far fa-cloud-upload',
    'far fa-cloud-upload-alt',
    'far fa-clouds',
    'far fa-clouds-moon',
    'far fa-clouds-sun',
    'far fa-club',
    'far fa-cocktail',
    'far fa-code',
    'far fa-code-branch',
    'far fa-code-commit',
    'far fa-code-merge',
    'far fa-coffee',
    'far fa-coffee-pot',
    'far fa-coffee-togo',
    'far fa-coffin',
    'far fa-coffin-cross',
    'far fa-cog',
    'far fa-cogs',
    'far fa-coin',
    'far fa-coins',
    'far fa-columns',
    'far fa-comet',
    'far fa-comment',
    'far fa-comment-alt',
    'far fa-comment-alt-check',
    'far fa-comment-alt-dollar',
    'far fa-comment-alt-dots',
    'far fa-comment-alt-edit',
    'far fa-comment-alt-exclamation',
    'far fa-comment-alt-lines',
    'far fa-comment-alt-medical',
    'far fa-comment-alt-minus',
    'far fa-comment-alt-music',
    'far fa-comment-alt-plus',
    'far fa-comment-alt-slash',
    'far fa-comment-alt-smile',
    'far fa-comment-alt-times',
    'far fa-comment-check',
    'far fa-comment-dollar',
    'far fa-comment-dots',
    'far fa-comment-edit',
    'far fa-comment-exclamation',
    'far fa-comment-lines',
    'far fa-comment-medical',
    'far fa-comment-minus',
    'far fa-comment-music',
    'far fa-comment-plus',
    'far fa-comment-slash',
    'far fa-comment-smile',
    'far fa-comment-times',
    'far fa-comments',
    'far fa-comments-alt',
    'far fa-comments-alt-dollar',
    'far fa-comments-dollar',
    'far fa-compact-disc',
    'far fa-compass',
    'far fa-compass-slash',
    'far fa-compress',
    'far fa-compress-alt',
    'far fa-compress-arrows-alt',
    'far fa-compress-wide',
    'far fa-computer-classic',
    'far fa-computer-speaker',
    'far fa-concierge-bell',
    'far fa-construction',
    'far fa-container-storage',
    'far fa-conveyor-belt',
    'far fa-conveyor-belt-alt',
    'far fa-cookie',
    'far fa-cookie-bite',
    'far fa-copy',
    'far fa-copyright',
    'far fa-corn',
    'far fa-couch',
    'far fa-cow',
    'far fa-cowbell',
    'far fa-cowbell-more',
    'far fa-credit-card',
    'far fa-credit-card-blank',
    'far fa-credit-card-front',
    'far fa-cricket',
    'far fa-croissant',
    'far fa-crop',
    'far fa-crop-alt',
    'far fa-cross',
    'far fa-crosshairs',
    'far fa-crow',
    'far fa-crown',
    'far fa-crutch',
    'far fa-crutches',
    'far fa-cube',
    'far fa-cubes',
    'far fa-curling',
    'far fa-cut',
    'far fa-dagger',
    'far fa-database',
    'far fa-deaf',
    'far fa-debug',
    'far fa-deer',
    'far fa-deer-rudolph',
    'far fa-democrat',
    'far fa-desktop',
    'far fa-desktop-alt',
    'far fa-dewpoint',
    'far fa-dharmachakra',
    'far fa-diagnoses',
    'far fa-diamond',
    'far fa-dice',
    'far fa-dice-d10',
    'far fa-dice-d12',
    'far fa-dice-d20',
    'far fa-dice-d4',
    'far fa-dice-d6',
    'far fa-dice-d8',
    'far fa-dice-five',
    'far fa-dice-four',
    'far fa-dice-one',
    'far fa-dice-six',
    'far fa-dice-three',
    'far fa-dice-two',
    'far fa-digging',
    'far fa-digital-tachograph',
    'far fa-diploma',
    'far fa-directions',
    'far fa-disc-drive',
    'far fa-disease',
    'far fa-divide',
    'far fa-dizzy',
    'far fa-dna',
    'far fa-do-not-enter',
    'far fa-dog',
    'far fa-dog-leashed',
    'far fa-dollar-sign',
    'far fa-dolly',
    'far fa-dolly-empty',
    'far fa-dolly-flatbed',
    'far fa-dolly-flatbed-alt',
    'far fa-dolly-flatbed-empty',
    'far fa-donate',
    'far fa-door-closed',
    'far fa-door-open',
    'far fa-dot-circle',
    'far fa-dove',
    'far fa-download',
    'far fa-drafting-compass',
    'far fa-dragon',
    'far fa-draw-circle',
    'far fa-draw-polygon',
    'far fa-draw-square',
    'far fa-dreidel',
    'far fa-drone',
    'far fa-drone-alt',
    'far fa-drum',
    'far fa-drum-steelpan',
    'far fa-drumstick',
    'far fa-drumstick-bite',
    'far fa-dryer',
    'far fa-dryer-alt',
    'far fa-duck',
    'far fa-dumbbell',
    'far fa-dumpster',
    'far fa-dumpster-fire',
    'far fa-dungeon',
    'far fa-ear',
    'far fa-ear-muffs',
    'far fa-eclipse',
    'far fa-eclipse-alt',
    'far fa-edit',
    'far fa-egg',
    'far fa-egg-fried',
    'far fa-eject',
    'far fa-elephant',
    'far fa-ellipsis-h',
    'far fa-ellipsis-h-alt',
    'far fa-ellipsis-v',
    'far fa-ellipsis-v-alt',
    'far fa-empty-set',
    'far fa-engine-warning',
    'far fa-envelope',
    'far fa-envelope-open',
    'far fa-envelope-open-dollar',
    'far fa-envelope-open-text',
    'far fa-envelope-square',
    'far fa-equals',
    'far fa-eraser',
    'far fa-ethernet',
    'far fa-euro-sign',
    'far fa-exchange',
    'far fa-exchange-alt',
    'far fa-exclamation',
    'far fa-exclamation-circle',
    'far fa-exclamation-square',
    'far fa-exclamation-triangle',
    'far fa-expand',
    'far fa-expand-alt',
    'far fa-expand-arrows',
    'far fa-expand-arrows-alt',
    'far fa-expand-wide',
    'far fa-external-link',
    'far fa-external-link-alt',
    'far fa-external-link-square',
    'far fa-external-link-square-alt',
    'far fa-eye',
    'far fa-eye-dropper',
    'far fa-eye-evil',
    'far fa-eye-slash',
    'far fa-fan',
    'far fa-fan-table',
    'far fa-farm',
    'far fa-fast-backward',
    'far fa-fast-forward',
    'far fa-faucet',
    'far fa-faucet-drip',
    'far fa-fax',
    'far fa-feather',
    'far fa-feather-alt',
    'far fa-female',
    'far fa-field-hockey',
    'far fa-fighter-jet',
    'far fa-file',
    'far fa-file-alt',
    'far fa-file-archive',
    'far fa-file-audio',
    'far fa-file-certificate',
    'far fa-file-chart-line',
    'far fa-file-chart-pie',
    'far fa-file-check',
    'far fa-file-code',
    'far fa-file-contract',
    'far fa-file-csv',
    'far fa-file-download',
    'far fa-file-edit',
    'far fa-file-excel',
    'far fa-file-exclamation',
    'far fa-file-export',
    'far fa-file-image',
    'far fa-file-import',
    'far fa-file-invoice',
    'far fa-file-invoice-dollar',
    'far fa-file-medical',
    'far fa-file-medical-alt',
    'far fa-file-minus',
    'far fa-file-music',
    'far fa-file-pdf',
    'far fa-file-plus',
    'far fa-file-powerpoint',
    'far fa-file-prescription',
    'far fa-file-search',
    'far fa-file-signature',
    'far fa-file-spreadsheet',
    'far fa-file-times',
    'far fa-file-upload',
    'far fa-file-user',
    'far fa-file-video',
    'far fa-file-word',
    'far fa-files-medical',
    'far fa-fill',
    'far fa-fill-drip',
    'far fa-film',
    'far fa-film-alt',
    'far fa-film-canister',
    'far fa-filter',
    'far fa-fingerprint',
    'far fa-fire',
    'far fa-fire-alt',
    'far fa-fire-extinguisher',
    'far fa-fire-smoke',
    'far fa-fireplace',
    'far fa-first-aid',
    'far fa-fish',
    'far fa-fish-cooked',
    'far fa-fist-raised',
    'far fa-flag',
    'far fa-flag-alt',
    'far fa-flag-checkered',
    'far fa-flag-usa',
    'far fa-flame',
    'far fa-flashlight',
    'far fa-flask',
    'far fa-flask-poison',
    'far fa-flask-potion',
    'far fa-flower',
    'far fa-flower-daffodil',
    'far fa-flower-tulip',
    'far fa-flushed',
    'far fa-flute',
    'far fa-flux-capacitor',
    'far fa-fog',
    'far fa-folder',
    'far fa-folder-download',
    'far fa-folder-minus',
    'far fa-folder-open',
    'far fa-folder-plus',
    'far fa-folder-times',
    'far fa-folder-tree',
    'far fa-folder-upload',
    'far fa-folders',
    'far fa-font',
    'far fa-font-case',
    'far fa-football-ball',
    'far fa-football-helmet',
    'far fa-forklift',
    'far fa-forward',
    'far fa-fragile',
    'far fa-french-fries',
    'far fa-frog',
    'far fa-frosty-head',
    'far fa-frown',
    'far fa-frown-open',
    'far fa-function',
    'far fa-funnel-dollar',
    'far fa-futbol',
    'far fa-galaxy',
    'far fa-game-board',
    'far fa-game-board-alt',
    'far fa-game-console-handheld',
    'far fa-gamepad',
    'far fa-gamepad-alt',
    'far fa-garage',
    'far fa-garage-car',
    'far fa-garage-open',
    'far fa-gas-pump',
    'far fa-gas-pump-slash',
    'far fa-gavel',
    'far fa-gem',
    'far fa-genderless',
    'far fa-ghost',
    'far fa-gift',
    'far fa-gift-card',
    'far fa-gifts',
    'far fa-gingerbread-man',
    'far fa-glass',
    'far fa-glass-champagne',
    'far fa-glass-cheers',
    'far fa-glass-citrus',
    'far fa-glass-martini',
    'far fa-glass-martini-alt',
    'far fa-glass-whiskey',
    'far fa-glass-whiskey-rocks',
    'far fa-glasses',
    'far fa-glasses-alt',
    'far fa-globe',
    'far fa-globe-africa',
    'far fa-globe-americas',
    'far fa-globe-asia',
    'far fa-globe-europe',
    'far fa-globe-snow',
    'far fa-globe-stand',
    'far fa-golf-ball',
    'far fa-golf-club',
    'far fa-gopuram',
    'far fa-graduation-cap',
    'far fa-gramophone',
    'far fa-greater-than',
    'far fa-greater-than-equal',
    'far fa-grimace',
    'far fa-grin',
    'far fa-grin-alt',
    'far fa-grin-beam',
    'far fa-grin-beam-sweat',
    'far fa-grin-hearts',
    'far fa-grin-squint',
    'far fa-grin-squint-tears',
    'far fa-grin-stars',
    'far fa-grin-tears',
    'far fa-grin-tongue',
    'far fa-grin-tongue-squint',
    'far fa-grin-tongue-wink',
    'far fa-grin-wink',
    'far fa-grip-horizontal',
    'far fa-grip-lines',
    'far fa-grip-lines-vertical',
    'far fa-grip-vertical',
    'far fa-guitar',
    'far fa-guitar-electric',
    'far fa-guitars',
    'far fa-h-square',
    'far fa-h1',
    'far fa-h2',
    'far fa-h3',
    'far fa-h4',
    'far fa-hamburger',
    'far fa-hammer',
    'far fa-hammer-war',
    'far fa-hamsa',
    'far fa-hand-heart',
    'far fa-hand-holding',
    'far fa-hand-holding-box',
    'far fa-hand-holding-heart',
    'far fa-hand-holding-magic',
    'far fa-hand-holding-medical',
    'far fa-hand-holding-seedling',
    'far fa-hand-holding-usd',
    'far fa-hand-holding-water',
    'far fa-hand-lizard',
    'far fa-hand-middle-finger',
    'far fa-hand-paper',
    'far fa-hand-peace',
    'far fa-hand-point-down',
    'far fa-hand-point-left',
    'far fa-hand-point-right',
    'far fa-hand-point-up',
    'far fa-hand-pointer',
    'far fa-hand-receiving',
    'far fa-hand-rock',
    'far fa-hand-scissors',
    'far fa-hand-sparkles',
    'far fa-hand-spock',
    'far fa-hands',
    'far fa-hands-heart',
    'far fa-hands-helping',
    'far fa-hands-usd',
    'far fa-hands-wash',
    'far fa-handshake',
    'far fa-handshake-alt',
    'far fa-handshake-alt-slash',
    'far fa-handshake-slash',
    'far fa-hanukiah',
    'far fa-hard-hat',
    'far fa-hashtag',
    'far fa-hat-chef',
    'far fa-hat-cowboy',
    'far fa-hat-cowboy-side',
    'far fa-hat-santa',
    'far fa-hat-winter',
    'far fa-hat-witch',
    'far fa-hat-wizard',
    'far fa-hdd',
    'far fa-head-side',
    'far fa-head-side-brain',
    'far fa-head-side-cough',
    'far fa-head-side-cough-slash',
    'far fa-head-side-headphones',
    'far fa-head-side-mask',
    'far fa-head-side-medical',
    'far fa-head-side-virus',
    'far fa-head-vr',
    'far fa-heading',
    'far fa-headphones',
    'far fa-headphones-alt',
    'far fa-headset',
    'far fa-heart',
    'far fa-heart-broken',
    'far fa-heart-circle',
    'far fa-heart-rate',
    'far fa-heart-square',
    'far fa-heartbeat',
    'far fa-heat',
    'far fa-helicopter',
    'far fa-helmet-battle',
    'far fa-hexagon',
    'far fa-highlighter',
    'far fa-hiking',
    'far fa-hippo',
    'far fa-history',
    'far fa-hockey-mask',
    'far fa-hockey-puck',
    'far fa-hockey-sticks',
    'far fa-holly-berry',
    'far fa-home',
    'far fa-home-alt',
    'far fa-home-heart',
    'far fa-home-lg',
    'far fa-home-lg-alt',
    'far fa-hood-cloak',
    'far fa-horizontal-rule',
    'far fa-horse',
    'far fa-horse-head',
    'far fa-horse-saddle',
    'far fa-hospital',
    'far fa-hospital-alt',
    'far fa-hospital-symbol',
    'far fa-hospital-user',
    'far fa-hospitals',
    'far fa-hot-tub',
    'far fa-hotdog',
    'far fa-hotel',
    'far fa-hourglass',
    'far fa-hourglass-end',
    'far fa-hourglass-half',
    'far fa-hourglass-start',
    'far fa-house',
    'far fa-house-damage',
    'far fa-house-day',
    'far fa-house-flood',
    'far fa-house-leave',
    'far fa-house-night',
    'far fa-house-return',
    'far fa-house-signal',
    'far fa-house-user',
    'far fa-hryvnia',
    'far fa-humidity',
    'far fa-hurricane',
    'far fa-i-cursor',
    'far fa-ice-cream',
    'far fa-ice-skate',
    'far fa-icicles',
    'far fa-icons',
    'far fa-icons-alt',
    'far fa-id-badge',
    'far fa-id-card',
    'far fa-id-card-alt',
    'far fa-igloo',
    'far fa-image',
    'far fa-image-polaroid',
    'far fa-images',
    'far fa-inbox',
    'far fa-inbox-in',
    'far fa-inbox-out',
    'far fa-indent',
    'far fa-industry',
    'far fa-industry-alt',
    'far fa-infinity',
    'far fa-info',
    'far fa-info-circle',
    'far fa-info-square',
    'far fa-inhaler',
    'far fa-integral',
    'far fa-intersection',
    'far fa-inventory',
    'far fa-island-tropical',
    'far fa-italic',
    'far fa-jack-o-lantern',
    'far fa-jedi',
    'far fa-joint',
    'far fa-journal-whills',
    'far fa-joystick',
    'far fa-jug',
    'far fa-kaaba',
    'far fa-kazoo',
    'far fa-kerning',
    'far fa-key',
    'far fa-key-skeleton',
    'far fa-keyboard',
    'far fa-keynote',
    'far fa-khanda',
    'far fa-kidneys',
    'far fa-kiss',
    'far fa-kiss-beam',
    'far fa-kiss-wink-heart',
    'far fa-kite',
    'far fa-kiwi-bird',
    'far fa-knife-kitchen',
    'far fa-lambda',
    'far fa-lamp',
    'far fa-lamp-desk',
    'far fa-lamp-floor',
    'far fa-landmark',
    'far fa-landmark-alt',
    'far fa-language',
    'far fa-laptop',
    'far fa-laptop-code',
    'far fa-laptop-house',
    'far fa-laptop-medical',
    'far fa-lasso',
    'far fa-laugh',
    'far fa-laugh-beam',
    'far fa-laugh-squint',
    'far fa-laugh-wink',
    'far fa-layer-group',
    'far fa-layer-minus',
    'far fa-layer-plus',
    'far fa-leaf',
    'far fa-leaf-heart',
    'far fa-leaf-maple',
    'far fa-leaf-oak',
    'far fa-lemon',
    'far fa-less-than',
    'far fa-less-than-equal',
    'far fa-level-down',
    'far fa-level-down-alt',
    'far fa-level-up',
    'far fa-level-up-alt',
    'far fa-life-ring',
    'far fa-light-ceiling',
    'far fa-light-switch',
    'far fa-light-switch-off',
    'far fa-light-switch-on',
    'far fa-lightbulb',
    'far fa-lightbulb-dollar',
    'far fa-lightbulb-exclamation',
    'far fa-lightbulb-on',
    'far fa-lightbulb-slash',
    'far fa-lights-holiday',
    'far fa-line-columns',
    'far fa-line-height',
    'far fa-link',
    'far fa-lips',
    'far fa-lira-sign',
    'far fa-list',
    'far fa-list-alt',
    'far fa-list-music',
    'far fa-list-ol',
    'far fa-list-ul',
    'far fa-location',
    'far fa-location-arrow',
    'far fa-location-circle',
    'far fa-location-slash',
    'far fa-lock',
    'far fa-lock-alt',
    'far fa-lock-open',
    'far fa-lock-open-alt',
    'far fa-long-arrow-alt-down',
    'far fa-long-arrow-alt-left',
    'far fa-long-arrow-alt-right',
    'far fa-long-arrow-alt-up',
    'far fa-long-arrow-down',
    'far fa-long-arrow-left',
    'far fa-long-arrow-right',
    'far fa-long-arrow-up',
    'far fa-loveseat',
    'far fa-low-vision',
    'far fa-luchador',
    'far fa-luggage-cart',
    'far fa-lungs',
    'far fa-lungs-virus',
    'far fa-mace',
    'far fa-magic',
    'far fa-magnet',
    'far fa-mail-bulk',
    'far fa-mailbox',
    'far fa-male',
    'far fa-mandolin',
    'far fa-map',
    'far fa-map-marked',
    'far fa-map-marked-alt',
    'far fa-map-marker',
    'far fa-map-marker-alt',
    'far fa-map-marker-alt-slash',
    'far fa-map-marker-check',
    'far fa-map-marker-edit',
    'far fa-map-marker-exclamation',
    'far fa-map-marker-minus',
    'far fa-map-marker-plus',
    'far fa-map-marker-question',
    'far fa-map-marker-slash',
    'far fa-map-marker-smile',
    'far fa-map-marker-times',
    'far fa-map-pin',
    'far fa-map-signs',
    'far fa-marker',
    'far fa-mars',
    'far fa-mars-double',
    'far fa-mars-stroke',
    'far fa-mars-stroke-h',
    'far fa-mars-stroke-v',
    'far fa-mask',
    'far fa-meat',
    'far fa-medal',
    'far fa-medkit',
    'far fa-megaphone',
    'far fa-meh',
    'far fa-meh-blank',
    'far fa-meh-rolling-eyes',
    'far fa-memory',
    'far fa-menorah',
    'far fa-mercury',
    'far fa-meteor',
    'far fa-microchip',
    'far fa-microphone',
    'far fa-microphone-alt',
    'far fa-microphone-alt-slash',
    'far fa-microphone-slash',
    'far fa-microphone-stand',
    'far fa-microscope',
    'far fa-microwave',
    'far fa-mind-share',
    'far fa-minus',
    'far fa-minus-circle',
    'far fa-minus-hexagon',
    'far fa-minus-octagon',
    'far fa-minus-square',
    'far fa-mistletoe',
    'far fa-mitten',
    'far fa-mobile',
    'far fa-mobile-alt',
    'far fa-mobile-android',
    'far fa-mobile-android-alt',
    'far fa-money-bill',
    'far fa-money-bill-alt',
    'far fa-money-bill-wave',
    'far fa-money-bill-wave-alt',
    'far fa-money-check',
    'far fa-money-check-alt',
    'far fa-money-check-edit',
    'far fa-money-check-edit-alt',
    'far fa-monitor-heart-rate',
    'far fa-monkey',
    'far fa-monument',
    'far fa-moon',
    'far fa-moon-cloud',
    'far fa-moon-stars',
    'far fa-mortar-pestle',
    'far fa-mosque',
    'far fa-motorcycle',
    'far fa-mountain',
    'far fa-mountains',
    'far fa-mouse',
    'far fa-mouse-alt',
    'far fa-mouse-pointer',
    'far fa-mp3-player',
    'far fa-mug',
    'far fa-mug-hot',
    'far fa-mug-marshmallows',
    'far fa-mug-tea',
    'far fa-music',
    'far fa-music-alt',
    'far fa-music-alt-slash',
    'far fa-music-slash',
    'far fa-narwhal',
    'far fa-network-wired',
    'far fa-neuter',
    'far fa-newspaper',
    'far fa-not-equal',
    'far fa-notes-medical',
    'far fa-object-group',
    'far fa-object-ungroup',
    'far fa-octagon',
    'far fa-oil-can',
    'far fa-oil-temp',
    'far fa-om',
    'far fa-omega',
    'far fa-ornament',
    'far fa-otter',
    'far fa-outdent',
    'far fa-outlet',
    'far fa-oven',
    'far fa-overline',
    'far fa-page-break',
    'far fa-pager',
    'far fa-paint-brush',
    'far fa-paint-brush-alt',
    'far fa-paint-roller',
    'far fa-palette',
    'far fa-pallet',
    'far fa-pallet-alt',
    'far fa-paper-plane',
    'far fa-paperclip',
    'far fa-parachute-box',
    'far fa-paragraph',
    'far fa-paragraph-rtl',
    'far fa-parking',
    'far fa-parking-circle',
    'far fa-parking-circle-slash',
    'far fa-parking-slash',
    'far fa-passport',
    'far fa-pastafarianism',
    'far fa-paste',
    'far fa-pause',
    'far fa-pause-circle',
    'far fa-paw',
    'far fa-paw-alt',
    'far fa-paw-claws',
    'far fa-peace',
    'far fa-pegasus',
    'far fa-pen',
    'far fa-pen-alt',
    'far fa-pen-fancy',
    'far fa-pen-nib',
    'far fa-pen-square',
    'far fa-pencil',
    'far fa-pencil-alt',
    'far fa-pencil-paintbrush',
    'far fa-pencil-ruler',
    'far fa-pennant',
    'far fa-people-arrows',
    'far fa-people-carry',
    'far fa-pepper-hot',
    'far fa-percent',
    'far fa-percentage',
    'far fa-person-booth',
    'far fa-person-carry',
    'far fa-person-dolly',
    'far fa-person-dolly-empty',
    'far fa-person-sign',
    'far fa-phone',
    'far fa-phone-alt',
    'far fa-phone-laptop',
    'far fa-phone-office',
    'far fa-phone-plus',
    'far fa-phone-rotary',
    'far fa-phone-slash',
    'far fa-phone-square',
    'far fa-phone-square-alt',
    'far fa-phone-volume',
    'far fa-photo-video',
    'far fa-pi',
    'far fa-piano',
    'far fa-piano-keyboard',
    'far fa-pie',
    'far fa-pig',
    'far fa-piggy-bank',
    'far fa-pills',
    'far fa-pizza',
    'far fa-pizza-slice',
    'far fa-place-of-worship',
    'far fa-plane',
    'far fa-plane-alt',
    'far fa-plane-arrival',
    'far fa-plane-departure',
    'far fa-plane-slash',
    'far fa-planet-moon',
    'far fa-planet-ringed',
    'far fa-play',
    'far fa-play-circle',
    'far fa-plug',
    'far fa-plus',
    'far fa-plus-circle',
    'far fa-plus-hexagon',
    'far fa-plus-octagon',
    'far fa-plus-square',
    'far fa-podcast',
    'far fa-podium',
    'far fa-podium-star',
    'far fa-police-box',
    'far fa-poll',
    'far fa-poll-h',
    'far fa-poll-people',
    'far fa-poo',
    'far fa-poo-storm',
    'far fa-poop',
    'far fa-popcorn',
    'far fa-portal-enter',
    'far fa-portal-exit',
    'far fa-portrait',
    'far fa-pound-sign',
    'far fa-power-off',
    'far fa-pray',
    'far fa-praying-hands',
    'far fa-prescription',
    'far fa-prescription-bottle',
    'far fa-prescription-bottle-alt',
    'far fa-presentation',
    'far fa-print',
    'far fa-print-search',
    'far fa-print-slash',
    'far fa-procedures',
    'far fa-project-diagram',
    'far fa-projector',
    'far fa-pump-medical',
    'far fa-pump-soap',
    'far fa-pumpkin',
    'far fa-puzzle-piece',
    'far fa-qrcode',
    'far fa-question',
    'far fa-question-circle',
    'far fa-question-square',
    'far fa-quidditch',
    'far fa-quote-left',
    'far fa-quote-right',
    'far fa-quran',
    'far fa-rabbit',
    'far fa-rabbit-fast',
    'far fa-racquet',
    'far fa-radar',
    'far fa-radiation',
    'far fa-radiation-alt',
    'far fa-radio',
    'far fa-radio-alt',
    'far fa-rainbow',
    'far fa-raindrops',
    'far fa-ram',
    'far fa-ramp-loading',
    'far fa-random',
    'far fa-raygun',
    'far fa-receipt',
    'far fa-record-vinyl',
    'far fa-rectangle-landscape',
    'far fa-rectangle-portrait',
    'far fa-rectangle-wide',
    'far fa-recycle',
    'far fa-redo',
    'far fa-redo-alt',
    'far fa-refrigerator',
    'far fa-registered',
    'far fa-remove-format',
    'far fa-repeat',
    'far fa-repeat-1',
    'far fa-repeat-1-alt',
    'far fa-repeat-alt',
    'far fa-reply',
    'far fa-reply-all',
    'far fa-republican',
    'far fa-restroom',
    'far fa-retweet',
    'far fa-retweet-alt',
    'far fa-ribbon',
    'far fa-ring',
    'far fa-rings-wedding',
    'far fa-road',
    'far fa-robot',
    'far fa-rocket',
    'far fa-rocket-launch',
    'far fa-route',
    'far fa-route-highway',
    'far fa-route-interstate',
    'far fa-router',
    'far fa-rss',
    'far fa-rss-square',
    'far fa-ruble-sign',
    'far fa-ruler',
    'far fa-ruler-combined',
    'far fa-ruler-horizontal',
    'far fa-ruler-triangle',
    'far fa-ruler-vertical',
    'far fa-running',
    'far fa-rupee-sign',
    'far fa-rv',
    'far fa-sack',
    'far fa-sack-dollar',
    'far fa-sad-cry',
    'far fa-sad-tear',
    'far fa-salad',
    'far fa-sandwich',
    'far fa-satellite',
    'far fa-satellite-dish',
    'far fa-sausage',
    'far fa-save',
    'far fa-sax-hot',
    'far fa-saxophone',
    'far fa-scalpel',
    'far fa-scalpel-path',
    'far fa-scanner',
    'far fa-scanner-image',
    'far fa-scanner-keyboard',
    'far fa-scanner-touchscreen',
    'far fa-scarecrow',
    'far fa-scarf',
    'far fa-school',
    'far fa-screwdriver',
    'far fa-scroll',
    'far fa-scroll-old',
    'far fa-scrubber',
    'far fa-scythe',
    'far fa-sd-card',
    'far fa-search',
    'far fa-search-dollar',
    'far fa-search-location',
    'far fa-search-minus',
    'far fa-search-plus',
    'far fa-seedling',
    'far fa-send-back',
    'far fa-send-backward',
    'far fa-sensor',
    'far fa-sensor-alert',
    'far fa-sensor-fire',
    'far fa-sensor-on',
    'far fa-sensor-smoke',
    'far fa-server',
    'far fa-shapes',
    'far fa-share',
    'far fa-share-all',
    'far fa-share-alt',
    'far fa-share-alt-square',
    'far fa-share-square',
    'far fa-sheep',
    'far fa-shekel-sign',
    'far fa-shield',
    'far fa-shield-alt',
    'far fa-shield-check',
    'far fa-shield-cross',
    'far fa-shield-virus',
    'far fa-ship',
    'far fa-shipping-fast',
    'far fa-shipping-timed',
    'far fa-shish-kebab',
    'far fa-shoe-prints',
    'far fa-shopping-bag',
    'far fa-shopping-basket',
    'far fa-shopping-cart',
    'far fa-shovel',
    'far fa-shovel-snow',
    'far fa-shower',
    'far fa-shredder',
    'far fa-shuttle-van',
    'far fa-shuttlecock',
    'far fa-sickle',
    'far fa-sigma',
    'far fa-sign',
    'far fa-sign-in',
    'far fa-sign-in-alt',
    'far fa-sign-language',
    'far fa-sign-out',
    'far fa-sign-out-alt',
    'far fa-signal',
    'far fa-signal-1',
    'far fa-signal-2',
    'far fa-signal-3',
    'far fa-signal-4',
    'far fa-signal-alt',
    'far fa-signal-alt-1',
    'far fa-signal-alt-2',
    'far fa-signal-alt-3',
    'far fa-signal-alt-slash',
    'far fa-signal-slash',
    'far fa-signal-stream',
    'far fa-signature',
    'far fa-sim-card',
    'far fa-sink',
    'far fa-siren',
    'far fa-siren-on',
    'far fa-sitemap',
    'far fa-skating',
    'far fa-skeleton',
    'far fa-ski-jump',
    'far fa-ski-lift',
    'far fa-skiing',
    'far fa-skiing-nordic',
    'far fa-skull',
    'far fa-skull-cow',
    'far fa-skull-crossbones',
    'far fa-slash',
    'far fa-sledding',
    'far fa-sleigh',
    'far fa-sliders-h',
    'far fa-sliders-h-square',
    'far fa-sliders-v',
    'far fa-sliders-v-square',
    'far fa-smile',
    'far fa-smile-beam',
    'far fa-smile-plus',
    'far fa-smile-wink',
    'far fa-smog',
    'far fa-smoke',
    'far fa-smoking',
    'far fa-smoking-ban',
    'far fa-sms',
    'far fa-snake',
    'far fa-snooze',
    'far fa-snow-blowing',
    'far fa-snowboarding',
    'far fa-snowflake',
    'far fa-snowflakes',
    'far fa-snowman',
    'far fa-snowmobile',
    'far fa-snowplow',
    'far fa-soap',
    'far fa-socks',
    'far fa-solar-panel',
    'far fa-solar-system',
    'far fa-sort',
    'far fa-sort-alpha-down',
    'far fa-sort-alpha-down-alt',
    'far fa-sort-alpha-up',
    'far fa-sort-alpha-up-alt',
    'far fa-sort-alt',
    'far fa-sort-amount-down',
    'far fa-sort-amount-down-alt',
    'far fa-sort-amount-up',
    'far fa-sort-amount-up-alt',
    'far fa-sort-circle',
    'far fa-sort-circle-down',
    'far fa-sort-circle-up',
    'far fa-sort-down',
    'far fa-sort-numeric-down',
    'far fa-sort-numeric-down-alt',
    'far fa-sort-numeric-up',
    'far fa-sort-numeric-up-alt',
    'far fa-sort-shapes-down',
    'far fa-sort-shapes-down-alt',
    'far fa-sort-shapes-up',
    'far fa-sort-shapes-up-alt',
    'far fa-sort-size-down',
    'far fa-sort-size-down-alt',
    'far fa-sort-size-up',
    'far fa-sort-size-up-alt',
    'far fa-sort-up',
    'far fa-soup',
    'far fa-spa',
    'far fa-space-shuttle',
    'far fa-space-station-moon',
    'far fa-space-station-moon-alt',
    'far fa-spade',
    'far fa-sparkles',
    'far fa-speaker',
    'far fa-speakers',
    'far fa-spell-check',
    'far fa-spider',
    'far fa-spider-black-widow',
    'far fa-spider-web',
    'far fa-spinner',
    'far fa-spinner-third',
    'far fa-splotch',
    'far fa-spray-can',
    'far fa-sprinkler',
    'far fa-square',
    'far fa-square-full',
    'far fa-square-root',
    'far fa-square-root-alt',
    'far fa-squirrel',
    'far fa-staff',
    'far fa-stamp',
    'far fa-star',
    'far fa-star-and-crescent',
    'far fa-star-christmas',
    'far fa-star-exclamation',
    'far fa-star-half',
    'far fa-star-half-alt',
    'far fa-star-of-david',
    'far fa-star-of-life',
    'far fa-star-shooting',
    'far fa-starfighter',
    'far fa-starfighter-alt',
    'far fa-stars',
    'far fa-starship',
    'far fa-starship-freighter',
    'far fa-steak',
    'far fa-steering-wheel',
    'far fa-step-backward',
    'far fa-step-forward',
    'far fa-stethoscope',
    'far fa-sticky-note',
    'far fa-stocking',
    'far fa-stomach',
    'far fa-stop',
    'far fa-stop-circle',
    'far fa-stopwatch',
    'far fa-stopwatch-20',
    'far fa-store',
    'far fa-store-alt',
    'far fa-store-alt-slash',
    'far fa-store-slash',
    'far fa-stream',
    'far fa-street-view',
    'far fa-stretcher',
    'far fa-strikethrough',
    'far fa-stroopwafel',
    'far fa-subscript',
    'far fa-subway',
    'far fa-suitcase',
    'far fa-suitcase-rolling',
    'far fa-sun',
    'far fa-sun-cloud',
    'far fa-sun-dust',
    'far fa-sun-haze',
    'far fa-sunglasses',
    'far fa-sunrise',
    'far fa-sunset',
    'far fa-superscript',
    'far fa-surprise',
    'far fa-swatchbook',
    'far fa-swimmer',
    'far fa-swimming-pool',
    'far fa-sword',
    'far fa-sword-laser',
    'far fa-sword-laser-alt',
    'far fa-swords',
    'far fa-swords-laser',
    'far fa-synagogue',
    'far fa-sync',
    'far fa-sync-alt',
    'far fa-syringe',
    'far fa-table',
    'far fa-table-tennis',
    'far fa-tablet',
    'far fa-tablet-alt',
    'far fa-tablet-android',
    'far fa-tablet-android-alt',
    'far fa-tablet-rugged',
    'far fa-tablets',
    'far fa-tachometer',
    'far fa-tachometer-alt',
    'far fa-tachometer-alt-average',
    'far fa-tachometer-alt-fast',
    'far fa-tachometer-alt-fastest',
    'far fa-tachometer-alt-slow',
    'far fa-tachometer-alt-slowest',
    'far fa-tachometer-average',
    'far fa-tachometer-fast',
    'far fa-tachometer-fastest',
    'far fa-tachometer-slow',
    'far fa-tachometer-slowest',
    'far fa-taco',
    'far fa-tag',
    'far fa-tags',
    'far fa-tally',
    'far fa-tanakh',
    'far fa-tape',
    'far fa-tasks',
    'far fa-tasks-alt',
    'far fa-taxi',
    'far fa-teeth',
    'far fa-teeth-open',
    'far fa-telescope',
    'far fa-temperature-down',
    'far fa-temperature-frigid',
    'far fa-temperature-high',
    'far fa-temperature-hot',
    'far fa-temperature-low',
    'far fa-temperature-up',
    'far fa-tenge',
    'far fa-tennis-ball',
    'far fa-terminal',
    'far fa-text',
    'far fa-text-height',
    'far fa-text-size',
    'far fa-text-width',
    'far fa-th',
    'far fa-th-large',
    'far fa-th-list',
    'far fa-theater-masks',
    'far fa-thermometer',
    'far fa-thermometer-empty',
    'far fa-thermometer-full',
    'far fa-thermometer-half',
    'far fa-thermometer-quarter',
    'far fa-thermometer-three-quarters',
    'far fa-theta',
    'far fa-thumbs-down',
    'far fa-thumbs-up',
    'far fa-thumbtack',
    'far fa-thunderstorm',
    'far fa-thunderstorm-moon',
    'far fa-thunderstorm-sun',
    'far fa-ticket',
    'far fa-ticket-alt',
    'far fa-tilde',
    'far fa-times',
    'far fa-times-circle',
    'far fa-times-hexagon',
    'far fa-times-octagon',
    'far fa-times-square',
    'far fa-tint',
    'far fa-tint-slash',
    'far fa-tire',
    'far fa-tire-flat',
    'far fa-tire-pressure-warning',
    'far fa-tire-rugged',
    'far fa-tired',
    'far fa-toggle-off',
    'far fa-toggle-on',
    'far fa-toilet',
    'far fa-toilet-paper',
    'far fa-toilet-paper-alt',
    'far fa-toilet-paper-slash',
    'far fa-tombstone',
    'far fa-tombstone-alt',
    'far fa-toolbox',
    'far fa-tools',
    'far fa-tooth',
    'far fa-toothbrush',
    'far fa-torah',
    'far fa-torii-gate',
    'far fa-tornado',
    'far fa-tractor',
    'far fa-trademark',
    'far fa-traffic-cone',
    'far fa-traffic-light',
    'far fa-traffic-light-go',
    'far fa-traffic-light-slow',
    'far fa-traffic-light-stop',
    'far fa-trailer',
    'far fa-train',
    'far fa-tram',
    'far fa-transgender',
    'far fa-transgender-alt',
    'far fa-transporter',
    'far fa-transporter-1',
    'far fa-transporter-2',
    'far fa-transporter-3',
    'far fa-transporter-empty',
    'far fa-trash',
    'far fa-trash-alt',
    'far fa-trash-restore',
    'far fa-trash-restore-alt',
    'far fa-trash-undo',
    'far fa-trash-undo-alt',
    'far fa-treasure-chest',
    'far fa-tree',
    'far fa-tree-alt',
    'far fa-tree-christmas',
    'far fa-tree-decorated',
    'far fa-tree-large',
    'far fa-tree-palm',
    'far fa-trees',
    'far fa-triangle',
    'far fa-triangle-music',
    'far fa-trophy',
    'far fa-trophy-alt',
    'far fa-truck',
    'far fa-truck-container',
    'far fa-truck-couch',
    'far fa-truck-loading',
    'far fa-truck-monster',
    'far fa-truck-moving',
    'far fa-truck-pickup',
    'far fa-truck-plow',
    'far fa-truck-ramp',
    'far fa-trumpet',
    'far fa-tshirt',
    'far fa-tty',
    'far fa-turkey',
    'far fa-turntable',
    'far fa-turtle',
    'far fa-tv',
    'far fa-tv-alt',
    'far fa-tv-music',
    'far fa-tv-retro',
    'far fa-typewriter',
    'far fa-ufo',
    'far fa-ufo-beam',
    'far fa-umbrella',
    'far fa-umbrella-beach',
    'far fa-underline',
    'far fa-undo',
    'far fa-undo-alt',
    'far fa-unicorn',
    'far fa-union',
    'far fa-universal-access',
    'far fa-university',
    'far fa-unlink',
    'far fa-unlock',
    'far fa-unlock-alt',
    'far fa-upload',
    'far fa-usb-drive',
    'far fa-usd-circle',
    'far fa-usd-square',
    'far fa-user',
    'far fa-user-alien',
    'far fa-user-alt',
    'far fa-user-alt-slash',
    'far fa-user-astronaut',
    'far fa-user-chart',
    'far fa-user-check',
    'far fa-user-circle',
    'far fa-user-clock',
    'far fa-user-cog',
    'far fa-user-cowboy',
    'far fa-user-crown',
    'far fa-user-edit',
    'far fa-user-friends',
    'far fa-user-graduate',
    'far fa-user-hard-hat',
    'far fa-user-headset',
    'far fa-user-injured',
    'far fa-user-lock',
    'far fa-user-md',
    'far fa-user-md-chat',
    'far fa-user-minus',
    'far fa-user-music',
    'far fa-user-ninja',
    'far fa-user-nurse',
    'far fa-user-plus',
    'far fa-user-robot',
    'far fa-user-secret',
    'far fa-user-shield',
    'far fa-user-slash',
    'far fa-user-tag',
    'far fa-user-tie',
    'far fa-user-times',
    'far fa-user-unlock',
    'far fa-user-visor',
    'far fa-users',
    'far fa-users-class',
    'far fa-users-cog',
    'far fa-users-crown',
    'far fa-users-medical',
    'far fa-users-slash',
    'far fa-utensil-fork',
    'far fa-utensil-knife',
    'far fa-utensil-spoon',
    'far fa-utensils',
    'far fa-utensils-alt',
    'far fa-vacuum',
    'far fa-vacuum-robot',
    'far fa-value-absolute',
    'far fa-vector-square',
    'far fa-venus',
    'far fa-venus-double',
    'far fa-venus-mars',
    'far fa-vest',
    'far fa-vest-patches',
    'far fa-vhs',
    'far fa-vial',
    'far fa-vials',
    'far fa-video',
    'far fa-video-plus',
    'far fa-video-slash',
    'far fa-vihara',
    'far fa-violin',
    'far fa-virus',
    'far fa-virus-slash',
    'far fa-viruses',
    'far fa-voicemail',
    'far fa-volcano',
    'far fa-volleyball-ball',
    'far fa-volume',
    'far fa-volume-down',
    'far fa-volume-mute',
    'far fa-volume-off',
    'far fa-volume-slash',
    'far fa-volume-up',
    'far fa-vote-nay',
    'far fa-vote-yea',
    'far fa-vr-cardboard',
    'far fa-wagon-covered',
    'far fa-walker',
    'far fa-walkie-talkie',
    'far fa-walking',
    'far fa-wallet',
    'far fa-wand',
    'far fa-wand-magic',
    'far fa-warehouse',
    'far fa-warehouse-alt',
    'far fa-washer',
    'far fa-watch',
    'far fa-watch-calculator',
    'far fa-watch-fitness',
    'far fa-water',
    'far fa-water-lower',
    'far fa-water-rise',
    'far fa-wave-sine',
    'far fa-wave-square',
    'far fa-wave-triangle',
    'far fa-waveform',
    'far fa-waveform-path',
    'far fa-webcam',
    'far fa-webcam-slash',
    'far fa-weight',
    'far fa-weight-hanging',
    'far fa-whale',
    'far fa-wheat',
    'far fa-wheelchair',
    'far fa-whistle',
    'far fa-wifi',
    'far fa-wifi-1',
    'far fa-wifi-2',
    'far fa-wifi-slash',
    'far fa-wind',
    'far fa-wind-turbine',
    'far fa-wind-warning',
    'far fa-window',
    'far fa-window-alt',
    'far fa-window-close',
    'far fa-window-frame',
    'far fa-window-frame-open',
    'far fa-window-maximize',
    'far fa-window-minimize',
    'far fa-window-restore',
    'far fa-windsock',
    'far fa-wine-bottle',
    'far fa-wine-glass',
    'far fa-wine-glass-alt',
    'far fa-won-sign',
    'far fa-wreath',
    'far fa-wrench',
    'far fa-x-ray',
    'far fa-yen-sign',
    'far fa-yin-yang',
    'fal fa-abacus',
    'fal fa-acorn',
    'fal fa-ad',
    'fal fa-address-book',
    'fal fa-address-card',
    'fal fa-adjust',
    'fal fa-air-conditioner',
    'fal fa-air-freshener',
    'fal fa-alarm-clock',
    'fal fa-alarm-exclamation',
    'fal fa-alarm-plus',
    'fal fa-alarm-snooze',
    'fal fa-album',
    'fal fa-album-collection',
    'fal fa-alicorn',
    'fal fa-alien',
    'fal fa-alien-monster',
    'fal fa-align-center',
    'fal fa-align-justify',
    'fal fa-align-left',
    'fal fa-align-right',
    'fal fa-align-slash',
    'fal fa-allergies',
    'fal fa-ambulance',
    'fal fa-american-sign-language-interpreting',
    'fal fa-amp-guitar',
    'fal fa-analytics',
    'fal fa-anchor',
    'fal fa-angel',
    'fal fa-angle-double-down',
    'fal fa-angle-double-left',
    'fal fa-angle-double-right',
    'fal fa-angle-double-up',
    'fal fa-angle-down',
    'fal fa-angle-left',
    'fal fa-angle-right',
    'fal fa-angle-up',
    'fal fa-angry',
    'fal fa-ankh',
    'fal fa-apple-alt',
    'fal fa-apple-crate',
    'fal fa-archive',
    'fal fa-archway',
    'fal fa-arrow-alt-circle-down',
    'fal fa-arrow-alt-circle-left',
    'fal fa-arrow-alt-circle-right',
    'fal fa-arrow-alt-circle-up',
    'fal fa-arrow-alt-down',
    'fal fa-arrow-alt-from-bottom',
    'fal fa-arrow-alt-from-left',
    'fal fa-arrow-alt-from-right',
    'fal fa-arrow-alt-from-top',
    'fal fa-arrow-alt-left',
    'fal fa-arrow-alt-right',
    'fal fa-arrow-alt-square-down',
    'fal fa-arrow-alt-square-left',
    'fal fa-arrow-alt-square-right',
    'fal fa-arrow-alt-square-up',
    'fal fa-arrow-alt-to-bottom',
    'fal fa-arrow-alt-to-left',
    'fal fa-arrow-alt-to-right',
    'fal fa-arrow-alt-to-top',
    'fal fa-arrow-alt-up',
    'fal fa-arrow-circle-down',
    'fal fa-arrow-circle-left',
    'fal fa-arrow-circle-right',
    'fal fa-arrow-circle-up',
    'fal fa-arrow-down',
    'fal fa-arrow-from-bottom',
    'fal fa-arrow-from-left',
    'fal fa-arrow-from-right',
    'fal fa-arrow-from-top',
    'fal fa-arrow-left',
    'fal fa-arrow-right',
    'fal fa-arrow-square-down',
    'fal fa-arrow-square-left',
    'fal fa-arrow-square-right',
    'fal fa-arrow-square-up',
    'fal fa-arrow-to-bottom',
    'fal fa-arrow-to-left',
    'fal fa-arrow-to-right',
    'fal fa-arrow-to-top',
    'fal fa-arrow-up',
    'fal fa-arrows',
    'fal fa-arrows-alt',
    'fal fa-arrows-alt-h',
    'fal fa-arrows-alt-v',
    'fal fa-arrows-h',
    'fal fa-arrows-v',
    'fal fa-assistive-listening-systems',
    'fal fa-asterisk',
    'fal fa-at',
    'fal fa-atlas',
    'fal fa-atom',
    'fal fa-atom-alt',
    'fal fa-audio-description',
    'fal fa-award',
    'fal fa-axe',
    'fal fa-axe-battle',
    'fal fa-baby',
    'fal fa-baby-carriage',
    'fal fa-backpack',
    'fal fa-backspace',
    'fal fa-backward',
    'fal fa-bacon',
    'fal fa-bacteria',
    'fal fa-bacterium',
    'fal fa-badge',
    'fal fa-badge-check',
    'fal fa-badge-dollar',
    'fal fa-badge-percent',
    'fal fa-badge-sheriff',
    'fal fa-badger-honey',
    'fal fa-bags-shopping',
    'fal fa-bahai',
    'fal fa-balance-scale',
    'fal fa-balance-scale-left',
    'fal fa-balance-scale-right',
    'fal fa-ball-pile',
    'fal fa-ballot',
    'fal fa-ballot-check',
    'fal fa-ban',
    'fal fa-band-aid',
    'fal fa-banjo',
    'fal fa-barcode',
    'fal fa-barcode-alt',
    'fal fa-barcode-read',
    'fal fa-barcode-scan',
    'fal fa-bars',
    'fal fa-baseball',
    'fal fa-baseball-ball',
    'fal fa-basketball-ball',
    'fal fa-basketball-hoop',
    'fal fa-bat',
    'fal fa-bath',
    'fal fa-battery-bolt',
    'fal fa-battery-empty',
    'fal fa-battery-full',
    'fal fa-battery-half',
    'fal fa-battery-quarter',
    'fal fa-battery-slash',
    'fal fa-battery-three-quarters',
    'fal fa-bed',
    'fal fa-bed-alt',
    'fal fa-bed-bunk',
    'fal fa-bed-empty',
    'fal fa-beer',
    'fal fa-bell',
    'fal fa-bell-exclamation',
    'fal fa-bell-on',
    'fal fa-bell-plus',
    'fal fa-bell-school',
    'fal fa-bell-school-slash',
    'fal fa-bell-slash',
    'fal fa-bells',
    'fal fa-betamax',
    'fal fa-bezier-curve',
    'fal fa-bible',
    'fal fa-bicycle',
    'fal fa-biking',
    'fal fa-biking-mountain',
    'fal fa-binoculars',
    'fal fa-biohazard',
    'fal fa-birthday-cake',
    'fal fa-blanket',
    'fal fa-blender',
    'fal fa-blender-phone',
    'fal fa-blind',
    'fal fa-blinds',
    'fal fa-blinds-open',
    'fal fa-blinds-raised',
    'fal fa-blog',
    'fal fa-bold',
    'fal fa-bolt',
    'fal fa-bomb',
    'fal fa-bone',
    'fal fa-bone-break',
    'fal fa-bong',
    'fal fa-book',
    'fal fa-book-alt',
    'fal fa-book-dead',
    'fal fa-book-heart',
    'fal fa-book-medical',
    'fal fa-book-open',
    'fal fa-book-reader',
    'fal fa-book-spells',
    'fal fa-book-user',
    'fal fa-bookmark',
    'fal fa-books',
    'fal fa-books-medical',
    'fal fa-boombox',
    'fal fa-boot',
    'fal fa-booth-curtain',
    'fal fa-border-all',
    'fal fa-border-bottom',
    'fal fa-border-center-h',
    'fal fa-border-center-v',
    'fal fa-border-inner',
    'fal fa-border-left',
    'fal fa-border-none',
    'fal fa-border-outer',
    'fal fa-border-right',
    'fal fa-border-style',
    'fal fa-border-style-alt',
    'fal fa-border-top',
    'fal fa-bow-arrow',
    'fal fa-bowling-ball',
    'fal fa-bowling-pins',
    'fal fa-box',
    'fal fa-box-alt',
    'fal fa-box-ballot',
    'fal fa-box-check',
    'fal fa-box-fragile',
    'fal fa-box-full',
    'fal fa-box-heart',
    'fal fa-box-open',
    'fal fa-box-tissue',
    'fal fa-box-up',
    'fal fa-box-usd',
    'fal fa-boxes',
    'fal fa-boxes-alt',
    'fal fa-boxing-glove',
    'fal fa-brackets',
    'fal fa-brackets-curly',
    'fal fa-braille',
    'fal fa-brain',
    'fal fa-bread-loaf',
    'fal fa-bread-slice',
    'fal fa-briefcase',
    'fal fa-briefcase-medical',
    'fal fa-bring-forward',
    'fal fa-bring-front',
    'fal fa-broadcast-tower',
    'fal fa-broom',
    'fal fa-browser',
    'fal fa-brush',
    'fal fa-bug',
    'fal fa-building',
    'fal fa-bullhorn',
    'fal fa-bullseye',
    'fal fa-bullseye-arrow',
    'fal fa-bullseye-pointer',
    'fal fa-burger-soda',
    'fal fa-burn',
    'fal fa-burrito',
    'fal fa-bus',
    'fal fa-bus-alt',
    'fal fa-bus-school',
    'fal fa-business-time',
    'fal fa-cabinet-filing',
    'fal fa-cactus',
    'fal fa-calculator',
    'fal fa-calculator-alt',
    'fal fa-calendar',
    'fal fa-calendar-alt',
    'fal fa-calendar-check',
    'fal fa-calendar-day',
    'fal fa-calendar-edit',
    'fal fa-calendar-exclamation',
    'fal fa-calendar-minus',
    'fal fa-calendar-plus',
    'fal fa-calendar-star',
    'fal fa-calendar-times',
    'fal fa-calendar-week',
    'fal fa-camcorder',
    'fal fa-camera',
    'fal fa-camera-alt',
    'fal fa-camera-home',
    'fal fa-camera-movie',
    'fal fa-camera-polaroid',
    'fal fa-camera-retro',
    'fal fa-campfire',
    'fal fa-campground',
    'fal fa-candle-holder',
    'fal fa-candy-cane',
    'fal fa-candy-corn',
    'fal fa-cannabis',
    'fal fa-capsules',
    'fal fa-car',
    'fal fa-car-alt',
    'fal fa-car-battery',
    'fal fa-car-building',
    'fal fa-car-bump',
    'fal fa-car-bus',
    'fal fa-car-crash',
    'fal fa-car-garage',
    'fal fa-car-mechanic',
    'fal fa-car-side',
    'fal fa-car-tilt',
    'fal fa-car-wash',
    'fal fa-caravan',
    'fal fa-caravan-alt',
    'fal fa-caret-circle-down',
    'fal fa-caret-circle-left',
    'fal fa-caret-circle-right',
    'fal fa-caret-circle-up',
    'fal fa-caret-down',
    'fal fa-caret-left',
    'fal fa-caret-right',
    'fal fa-caret-square-down',
    'fal fa-caret-square-left',
    'fal fa-caret-square-right',
    'fal fa-caret-square-up',
    'fal fa-caret-up',
    'fal fa-carrot',
    'fal fa-cars',
    'fal fa-cart-arrow-down',
    'fal fa-cart-plus',
    'fal fa-cash-register',
    'fal fa-cassette-tape',
    'fal fa-cat',
    'fal fa-cat-space',
    'fal fa-cauldron',
    'fal fa-cctv',
    'fal fa-certificate',
    'fal fa-chair',
    'fal fa-chair-office',
    'fal fa-chalkboard',
    'fal fa-chalkboard-teacher',
    'fal fa-charging-station',
    'fal fa-chart-area',
    'fal fa-chart-bar',
    'fal fa-chart-line',
    'fal fa-chart-line-down',
    'fal fa-chart-network',
    'fal fa-chart-pie',
    'fal fa-chart-pie-alt',
    'fal fa-chart-scatter',
    'fal fa-check',
    'fal fa-check-circle',
    'fal fa-check-double',
    'fal fa-check-square',
    'fal fa-cheese',
    'fal fa-cheese-swiss',
    'fal fa-cheeseburger',
    'fal fa-chess',
    'fal fa-chess-bishop',
    'fal fa-chess-bishop-alt',
    'fal fa-chess-board',
    'fal fa-chess-clock',
    'fal fa-chess-clock-alt',
    'fal fa-chess-king',
    'fal fa-chess-king-alt',
    'fal fa-chess-knight',
    'fal fa-chess-knight-alt',
    'fal fa-chess-pawn',
    'fal fa-chess-pawn-alt',
    'fal fa-chess-queen',
    'fal fa-chess-queen-alt',
    'fal fa-chess-rook',
    'fal fa-chess-rook-alt',
    'fal fa-chevron-circle-down',
    'fal fa-chevron-circle-left',
    'fal fa-chevron-circle-right',
    'fal fa-chevron-circle-up',
    'fal fa-chevron-double-down',
    'fal fa-chevron-double-left',
    'fal fa-chevron-double-right',
    'fal fa-chevron-double-up',
    'fal fa-chevron-down',
    'fal fa-chevron-left',
    'fal fa-chevron-right',
    'fal fa-chevron-square-down',
    'fal fa-chevron-square-left',
    'fal fa-chevron-square-right',
    'fal fa-chevron-square-up',
    'fal fa-chevron-up',
    'fal fa-child',
    'fal fa-chimney',
    'fal fa-church',
    'fal fa-circle',
    'fal fa-circle-notch',
    'fal fa-city',
    'fal fa-clarinet',
    'fal fa-claw-marks',
    'fal fa-clinic-medical',
    'fal fa-clipboard',
    'fal fa-clipboard-check',
    'fal fa-clipboard-list',
    'fal fa-clipboard-list-check',
    'fal fa-clipboard-prescription',
    'fal fa-clipboard-user',
    'fal fa-clock',
    'fal fa-clone',
    'fal fa-closed-captioning',
    'fal fa-cloud',
    'fal fa-cloud-download',
    'fal fa-cloud-download-alt',
    'fal fa-cloud-drizzle',
    'fal fa-cloud-hail',
    'fal fa-cloud-hail-mixed',
    'fal fa-cloud-meatball',
    'fal fa-cloud-moon',
    'fal fa-cloud-moon-rain',
    'fal fa-cloud-music',
    'fal fa-cloud-rain',
    'fal fa-cloud-rainbow',
    'fal fa-cloud-showers',
    'fal fa-cloud-showers-heavy',
    'fal fa-cloud-sleet',
    'fal fa-cloud-snow',
    'fal fa-cloud-sun',
    'fal fa-cloud-sun-rain',
    'fal fa-cloud-upload',
    'fal fa-cloud-upload-alt',
    'fal fa-clouds',
    'fal fa-clouds-moon',
    'fal fa-clouds-sun',
    'fal fa-club',
    'fal fa-cocktail',
    'fal fa-code',
    'fal fa-code-branch',
    'fal fa-code-commit',
    'fal fa-code-merge',
    'fal fa-coffee',
    'fal fa-coffee-pot',
    'fal fa-coffee-togo',
    'fal fa-coffin',
    'fal fa-coffin-cross',
    'fal fa-cog',
    'fal fa-cogs',
    'fal fa-coin',
    'fal fa-coins',
    'fal fa-columns',
    'fal fa-comet',
    'fal fa-comment',
    'fal fa-comment-alt',
    'fal fa-comment-alt-check',
    'fal fa-comment-alt-dollar',
    'fal fa-comment-alt-dots',
    'fal fa-comment-alt-edit',
    'fal fa-comment-alt-exclamation',
    'fal fa-comment-alt-lines',
    'fal fa-comment-alt-medical',
    'fal fa-comment-alt-minus',
    'fal fa-comment-alt-music',
    'fal fa-comment-alt-plus',
    'fal fa-comment-alt-slash',
    'fal fa-comment-alt-smile',
    'fal fa-comment-alt-times',
    'fal fa-comment-check',
    'fal fa-comment-dollar',
    'fal fa-comment-dots',
    'fal fa-comment-edit',
    'fal fa-comment-exclamation',
    'fal fa-comment-lines',
    'fal fa-comment-medical',
    'fal fa-comment-minus',
    'fal fa-comment-music',
    'fal fa-comment-plus',
    'fal fa-comment-slash',
    'fal fa-comment-smile',
    'fal fa-comment-times',
    'fal fa-comments',
    'fal fa-comments-alt',
    'fal fa-comments-alt-dollar',
    'fal fa-comments-dollar',
    'fal fa-compact-disc',
    'fal fa-compass',
    'fal fa-compass-slash',
    'fal fa-compress',
    'fal fa-compress-alt',
    'fal fa-compress-arrows-alt',
    'fal fa-compress-wide',
    'fal fa-computer-classic',
    'fal fa-computer-speaker',
    'fal fa-concierge-bell',
    'fal fa-construction',
    'fal fa-container-storage',
    'fal fa-conveyor-belt',
    'fal fa-conveyor-belt-alt',
    'fal fa-cookie',
    'fal fa-cookie-bite',
    'fal fa-copy',
    'fal fa-copyright',
    'fal fa-corn',
    'fal fa-couch',
    'fal fa-cow',
    'fal fa-cowbell',
    'fal fa-cowbell-more',
    'fal fa-credit-card',
    'fal fa-credit-card-blank',
    'fal fa-credit-card-front',
    'fal fa-cricket',
    'fal fa-croissant',
    'fal fa-crop',
    'fal fa-crop-alt',
    'fal fa-cross',
    'fal fa-crosshairs',
    'fal fa-crow',
    'fal fa-crown',
    'fal fa-crutch',
    'fal fa-crutches',
    'fal fa-cube',
    'fal fa-cubes',
    'fal fa-curling',
    'fal fa-cut',
    'fal fa-dagger',
    'fal fa-database',
    'fal fa-deaf',
    'fal fa-debug',
    'fal fa-deer',
    'fal fa-deer-rudolph',
    'fal fa-democrat',
    'fal fa-desktop',
    'fal fa-desktop-alt',
    'fal fa-dewpoint',
    'fal fa-dharmachakra',
    'fal fa-diagnoses',
    'fal fa-diamond',
    'fal fa-dice',
    'fal fa-dice-d10',
    'fal fa-dice-d12',
    'fal fa-dice-d20',
    'fal fa-dice-d4',
    'fal fa-dice-d6',
    'fal fa-dice-d8',
    'fal fa-dice-five',
    'fal fa-dice-four',
    'fal fa-dice-one',
    'fal fa-dice-six',
    'fal fa-dice-three',
    'fal fa-dice-two',
    'fal fa-digging',
    'fal fa-digital-tachograph',
    'fal fa-diploma',
    'fal fa-directions',
    'fal fa-disc-drive',
    'fal fa-disease',
    'fal fa-divide',
    'fal fa-dizzy',
    'fal fa-dna',
    'fal fa-do-not-enter',
    'fal fa-dog',
    'fal fa-dog-leashed',
    'fal fa-dollar-sign',
    'fal fa-dolly',
    'fal fa-dolly-empty',
    'fal fa-dolly-flatbed',
    'fal fa-dolly-flatbed-alt',
    'fal fa-dolly-flatbed-empty',
    'fal fa-donate',
    'fal fa-door-closed',
    'fal fa-door-open',
    'fal fa-dot-circle',
    'fal fa-dove',
    'fal fa-download',
    'fal fa-drafting-compass',
    'fal fa-dragon',
    'fal fa-draw-circle',
    'fal fa-draw-polygon',
    'fal fa-draw-square',
    'fal fa-dreidel',
    'fal fa-drone',
    'fal fa-drone-alt',
    'fal fa-drum',
    'fal fa-drum-steelpan',
    'fal fa-drumstick',
    'fal fa-drumstick-bite',
    'fal fa-dryer',
    'fal fa-dryer-alt',
    'fal fa-duck',
    'fal fa-dumbbell',
    'fal fa-dumpster',
    'fal fa-dumpster-fire',
    'fal fa-dungeon',
    'fal fa-ear',
    'fal fa-ear-muffs',
    'fal fa-eclipse',
    'fal fa-eclipse-alt',
    'fal fa-edit',
    'fal fa-egg',
    'fal fa-egg-fried',
    'fal fa-eject',
    'fal fa-elephant',
    'fal fa-ellipsis-h',
    'fal fa-ellipsis-h-alt',
    'fal fa-ellipsis-v',
    'fal fa-ellipsis-v-alt',
    'fal fa-empty-set',
    'fal fa-engine-warning',
    'fal fa-envelope',
    'fal fa-envelope-open',
    'fal fa-envelope-open-dollar',
    'fal fa-envelope-open-text',
    'fal fa-envelope-square',
    'fal fa-equals',
    'fal fa-eraser',
    'fal fa-ethernet',
    'fal fa-euro-sign',
    'fal fa-exchange',
    'fal fa-exchange-alt',
    'fal fa-exclamation',
    'fal fa-exclamation-circle',
    'fal fa-exclamation-square',
    'fal fa-exclamation-triangle',
    'fal fa-expand',
    'fal fa-expand-alt',
    'fal fa-expand-arrows',
    'fal fa-expand-arrows-alt',
    'fal fa-expand-wide',
    'fal fa-external-link',
    'fal fa-external-link-alt',
    'fal fa-external-link-square',
    'fal fa-external-link-square-alt',
    'fal fa-eye',
    'fal fa-eye-dropper',
    'fal fa-eye-evil',
    'fal fa-eye-slash',
    'fal fa-fan',
    'fal fa-fan-table',
    'fal fa-farm',
    'fal fa-fast-backward',
    'fal fa-fast-forward',
    'fal fa-faucet',
    'fal fa-faucet-drip',
    'fal fa-fax',
    'fal fa-feather',
    'fal fa-feather-alt',
    'fal fa-female',
    'fal fa-field-hockey',
    'fal fa-fighter-jet',
    'fal fa-file',
    'fal fa-file-alt',
    'fal fa-file-archive',
    'fal fa-file-audio',
    'fal fa-file-certificate',
    'fal fa-file-chart-line',
    'fal fa-file-chart-pie',
    'fal fa-file-check',
    'fal fa-file-code',
    'fal fa-file-contract',
    'fal fa-file-csv',
    'fal fa-file-download',
    'fal fa-file-edit',
    'fal fa-file-excel',
    'fal fa-file-exclamation',
    'fal fa-file-export',
    'fal fa-file-image',
    'fal fa-file-import',
    'fal fa-file-invoice',
    'fal fa-file-invoice-dollar',
    'fal fa-file-medical',
    'fal fa-file-medical-alt',
    'fal fa-file-minus',
    'fal fa-file-music',
    'fal fa-file-pdf',
    'fal fa-file-plus',
    'fal fa-file-powerpoint',
    'fal fa-file-prescription',
    'fal fa-file-search',
    'fal fa-file-signature',
    'fal fa-file-spreadsheet',
    'fal fa-file-times',
    'fal fa-file-upload',
    'fal fa-file-user',
    'fal fa-file-video',
    'fal fa-file-word',
    'fal fa-files-medical',
    'fal fa-fill',
    'fal fa-fill-drip',
    'fal fa-film',
    'fal fa-film-alt',
    'fal fa-film-canister',
    'fal fa-filter',
    'fal fa-fingerprint',
    'fal fa-fire',
    'fal fa-fire-alt',
    'fal fa-fire-extinguisher',
    'fal fa-fire-smoke',
    'fal fa-fireplace',
    'fal fa-first-aid',
    'fal fa-fish',
    'fal fa-fish-cooked',
    'fal fa-fist-raised',
    'fal fa-flag',
    'fal fa-flag-alt',
    'fal fa-flag-checkered',
    'fal fa-flag-usa',
    'fal fa-flame',
    'fal fa-flashlight',
    'fal fa-flask',
    'fal fa-flask-poison',
    'fal fa-flask-potion',
    'fal fa-flower',
    'fal fa-flower-daffodil',
    'fal fa-flower-tulip',
    'fal fa-flushed',
    'fal fa-flute',
    'fal fa-flux-capacitor',
    'fal fa-fog',
    'fal fa-folder',
    'fal fa-folder-download',
    'fal fa-folder-minus',
    'fal fa-folder-open',
    'fal fa-folder-plus',
    'fal fa-folder-times',
    'fal fa-folder-tree',
    'fal fa-folder-upload',
    'fal fa-folders',
    'fal fa-font',
    'fal fa-font-case',
    'fal fa-football-ball',
    'fal fa-football-helmet',
    'fal fa-forklift',
    'fal fa-forward',
    'fal fa-fragile',
    'fal fa-french-fries',
    'fal fa-frog',
    'fal fa-frosty-head',
    'fal fa-frown',
    'fal fa-frown-open',
    'fal fa-function',
    'fal fa-funnel-dollar',
    'fal fa-futbol',
    'fal fa-galaxy',
    'fal fa-game-board',
    'fal fa-game-board-alt',
    'fal fa-game-console-handheld',
    'fal fa-gamepad',
    'fal fa-gamepad-alt',
    'fal fa-garage',
    'fal fa-garage-car',
    'fal fa-garage-open',
    'fal fa-gas-pump',
    'fal fa-gas-pump-slash',
    'fal fa-gavel',
    'fal fa-gem',
    'fal fa-genderless',
    'fal fa-ghost',
    'fal fa-gift',
    'fal fa-gift-card',
    'fal fa-gifts',
    'fal fa-gingerbread-man',
    'fal fa-glass',
    'fal fa-glass-champagne',
    'fal fa-glass-cheers',
    'fal fa-glass-citrus',
    'fal fa-glass-martini',
    'fal fa-glass-martini-alt',
    'fal fa-glass-whiskey',
    'fal fa-glass-whiskey-rocks',
    'fal fa-glasses',
    'fal fa-glasses-alt',
    'fal fa-globe',
    'fal fa-globe-africa',
    'fal fa-globe-americas',
    'fal fa-globe-asia',
    'fal fa-globe-europe',
    'fal fa-globe-snow',
    'fal fa-globe-stand',
    'fal fa-golf-ball',
    'fal fa-golf-club',
    'fal fa-gopuram',
    'fal fa-graduation-cap',
    'fal fa-gramophone',
    'fal fa-greater-than',
    'fal fa-greater-than-equal',
    'fal fa-grimace',
    'fal fa-grin',
    'fal fa-grin-alt',
    'fal fa-grin-beam',
    'fal fa-grin-beam-sweat',
    'fal fa-grin-hearts',
    'fal fa-grin-squint',
    'fal fa-grin-squint-tears',
    'fal fa-grin-stars',
    'fal fa-grin-tears',
    'fal fa-grin-tongue',
    'fal fa-grin-tongue-squint',
    'fal fa-grin-tongue-wink',
    'fal fa-grin-wink',
    'fal fa-grip-horizontal',
    'fal fa-grip-lines',
    'fal fa-grip-lines-vertical',
    'fal fa-grip-vertical',
    'fal fa-guitar',
    'fal fa-guitar-electric',
    'fal fa-guitars',
    'fal fa-h-square',
    'fal fa-h1',
    'fal fa-h2',
    'fal fa-h3',
    'fal fa-h4',
    'fal fa-hamburger',
    'fal fa-hammer',
    'fal fa-hammer-war',
    'fal fa-hamsa',
    'fal fa-hand-heart',
    'fal fa-hand-holding',
    'fal fa-hand-holding-box',
    'fal fa-hand-holding-heart',
    'fal fa-hand-holding-magic',
    'fal fa-hand-holding-medical',
    'fal fa-hand-holding-seedling',
    'fal fa-hand-holding-usd',
    'fal fa-hand-holding-water',
    'fal fa-hand-lizard',
    'fal fa-hand-middle-finger',
    'fal fa-hand-paper',
    'fal fa-hand-peace',
    'fal fa-hand-point-down',
    'fal fa-hand-point-left',
    'fal fa-hand-point-right',
    'fal fa-hand-point-up',
    'fal fa-hand-pointer',
    'fal fa-hand-receiving',
    'fal fa-hand-rock',
    'fal fa-hand-scissors',
    'fal fa-hand-sparkles',
    'fal fa-hand-spock',
    'fal fa-hands',
    'fal fa-hands-heart',
    'fal fa-hands-helping',
    'fal fa-hands-usd',
    'fal fa-hands-wash',
    'fal fa-handshake',
    'fal fa-handshake-alt',
    'fal fa-handshake-alt-slash',
    'fal fa-handshake-slash',
    'fal fa-hanukiah',
    'fal fa-hard-hat',
    'fal fa-hashtag',
    'fal fa-hat-chef',
    'fal fa-hat-cowboy',
    'fal fa-hat-cowboy-side',
    'fal fa-hat-santa',
    'fal fa-hat-winter',
    'fal fa-hat-witch',
    'fal fa-hat-wizard',
    'fal fa-hdd',
    'fal fa-head-side',
    'fal fa-head-side-brain',
    'fal fa-head-side-cough',
    'fal fa-head-side-cough-slash',
    'fal fa-head-side-headphones',
    'fal fa-head-side-mask',
    'fal fa-head-side-medical',
    'fal fa-head-side-virus',
    'fal fa-head-vr',
    'fal fa-heading',
    'fal fa-headphones',
    'fal fa-headphones-alt',
    'fal fa-headset',
    'fal fa-heart',
    'fal fa-heart-broken',
    'fal fa-heart-circle',
    'fal fa-heart-rate',
    'fal fa-heart-square',
    'fal fa-heartbeat',
    'fal fa-heat',
    'fal fa-helicopter',
    'fal fa-helmet-battle',
    'fal fa-hexagon',
    'fal fa-highlighter',
    'fal fa-hiking',
    'fal fa-hippo',
    'fal fa-history',
    'fal fa-hockey-mask',
    'fal fa-hockey-puck',
    'fal fa-hockey-sticks',
    'fal fa-holly-berry',
    'fal fa-home',
    'fal fa-home-alt',
    'fal fa-home-heart',
    'fal fa-home-lg',
    'fal fa-home-lg-alt',
    'fal fa-hood-cloak',
    'fal fa-horizontal-rule',
    'fal fa-horse',
    'fal fa-horse-head',
    'fal fa-horse-saddle',
    'fal fa-hospital',
    'fal fa-hospital-alt',
    'fal fa-hospital-symbol',
    'fal fa-hospital-user',
    'fal fa-hospitals',
    'fal fa-hot-tub',
    'fal fa-hotdog',
    'fal fa-hotel',
    'fal fa-hourglass',
    'fal fa-hourglass-end',
    'fal fa-hourglass-half',
    'fal fa-hourglass-start',
    'fal fa-house',
    'fal fa-house-damage',
    'fal fa-house-day',
    'fal fa-house-flood',
    'fal fa-house-leave',
    'fal fa-house-night',
    'fal fa-house-return',
    'fal fa-house-signal',
    'fal fa-house-user',
    'fal fa-hryvnia',
    'fal fa-humidity',
    'fal fa-hurricane',
    'fal fa-i-cursor',
    'fal fa-ice-cream',
    'fal fa-ice-skate',
    'fal fa-icicles',
    'fal fa-icons',
    'fal fa-icons-alt',
    'fal fa-id-badge',
    'fal fa-id-card',
    'fal fa-id-card-alt',
    'fal fa-igloo',
    'fal fa-image',
    'fal fa-image-polaroid',
    'fal fa-images',
    'fal fa-inbox',
    'fal fa-inbox-in',
    'fal fa-inbox-out',
    'fal fa-indent',
    'fal fa-industry',
    'fal fa-industry-alt',
    'fal fa-infinity',
    'fal fa-info',
    'fal fa-info-circle',
    'fal fa-info-square',
    'fal fa-inhaler',
    'fal fa-integral',
    'fal fa-intersection',
    'fal fa-inventory',
    'fal fa-island-tropical',
    'fal fa-italic',
    'fal fa-jack-o-lantern',
    'fal fa-jedi',
    'fal fa-joint',
    'fal fa-journal-whills',
    'fal fa-joystick',
    'fal fa-jug',
    'fal fa-kaaba',
    'fal fa-kazoo',
    'fal fa-kerning',
    'fal fa-key',
    'fal fa-key-skeleton',
    'fal fa-keyboard',
    'fal fa-keynote',
    'fal fa-khanda',
    'fal fa-kidneys',
    'fal fa-kiss',
    'fal fa-kiss-beam',
    'fal fa-kiss-wink-heart',
    'fal fa-kite',
    'fal fa-kiwi-bird',
    'fal fa-knife-kitchen',
    'fal fa-lambda',
    'fal fa-lamp',
    'fal fa-lamp-desk',
    'fal fa-lamp-floor',
    'fal fa-landmark',
    'fal fa-landmark-alt',
    'fal fa-language',
    'fal fa-laptop',
    'fal fa-laptop-code',
    'fal fa-laptop-house',
    'fal fa-laptop-medical',
    'fal fa-lasso',
    'fal fa-laugh',
    'fal fa-laugh-beam',
    'fal fa-laugh-squint',
    'fal fa-laugh-wink',
    'fal fa-layer-group',
    'fal fa-layer-minus',
    'fal fa-layer-plus',
    'fal fa-leaf',
    'fal fa-leaf-heart',
    'fal fa-leaf-maple',
    'fal fa-leaf-oak',
    'fal fa-lemon',
    'fal fa-less-than',
    'fal fa-less-than-equal',
    'fal fa-level-down',
    'fal fa-level-down-alt',
    'fal fa-level-up',
    'fal fa-level-up-alt',
    'fal fa-life-ring',
    'fal fa-light-ceiling',
    'fal fa-light-switch',
    'fal fa-light-switch-off',
    'fal fa-light-switch-on',
    'fal fa-lightbulb',
    'fal fa-lightbulb-dollar',
    'fal fa-lightbulb-exclamation',
    'fal fa-lightbulb-on',
    'fal fa-lightbulb-slash',
    'fal fa-lights-holiday',
    'fal fa-line-columns',
    'fal fa-line-height',
    'fal fa-link',
    'fal fa-lips',
    'fal fa-lira-sign',
    'fal fa-list',
    'fal fa-list-alt',
    'fal fa-list-music',
    'fal fa-list-ol',
    'fal fa-list-ul',
    'fal fa-location',
    'fal fa-location-arrow',
    'fal fa-location-circle',
    'fal fa-location-slash',
    'fal fa-lock',
    'fal fa-lock-alt',
    'fal fa-lock-open',
    'fal fa-lock-open-alt',
    'fal fa-long-arrow-alt-down',
    'fal fa-long-arrow-alt-left',
    'fal fa-long-arrow-alt-right',
    'fal fa-long-arrow-alt-up',
    'fal fa-long-arrow-down',
    'fal fa-long-arrow-left',
    'fal fa-long-arrow-right',
    'fal fa-long-arrow-up',
    'fal fa-loveseat',
    'fal fa-low-vision',
    'fal fa-luchador',
    'fal fa-luggage-cart',
    'fal fa-lungs',
    'fal fa-lungs-virus',
    'fal fa-mace',
    'fal fa-magic',
    'fal fa-magnet',
    'fal fa-mail-bulk',
    'fal fa-mailbox',
    'fal fa-male',
    'fal fa-mandolin',
    'fal fa-map',
    'fal fa-map-marked',
    'fal fa-map-marked-alt',
    'fal fa-map-marker',
    'fal fa-map-marker-alt',
    'fal fa-map-marker-alt-slash',
    'fal fa-map-marker-check',
    'fal fa-map-marker-edit',
    'fal fa-map-marker-exclamation',
    'fal fa-map-marker-minus',
    'fal fa-map-marker-plus',
    'fal fa-map-marker-question',
    'fal fa-map-marker-slash',
    'fal fa-map-marker-smile',
    'fal fa-map-marker-times',
    'fal fa-map-pin',
    'fal fa-map-signs',
    'fal fa-marker',
    'fal fa-mars',
    'fal fa-mars-double',
    'fal fa-mars-stroke',
    'fal fa-mars-stroke-h',
    'fal fa-mars-stroke-v',
    'fal fa-mask',
    'fal fa-meat',
    'fal fa-medal',
    'fal fa-medkit',
    'fal fa-megaphone',
    'fal fa-meh',
    'fal fa-meh-blank',
    'fal fa-meh-rolling-eyes',
    'fal fa-memory',
    'fal fa-menorah',
    'fal fa-mercury',
    'fal fa-meteor',
    'fal fa-microchip',
    'fal fa-microphone',
    'fal fa-microphone-alt',
    'fal fa-microphone-alt-slash',
    'fal fa-microphone-slash',
    'fal fa-microphone-stand',
    'fal fa-microscope',
    'fal fa-microwave',
    'fal fa-mind-share',
    'fal fa-minus',
    'fal fa-minus-circle',
    'fal fa-minus-hexagon',
    'fal fa-minus-octagon',
    'fal fa-minus-square',
    'fal fa-mistletoe',
    'fal fa-mitten',
    'fal fa-mobile',
    'fal fa-mobile-alt',
    'fal fa-mobile-android',
    'fal fa-mobile-android-alt',
    'fal fa-money-bill',
    'fal fa-money-bill-alt',
    'fal fa-money-bill-wave',
    'fal fa-money-bill-wave-alt',
    'fal fa-money-check',
    'fal fa-money-check-alt',
    'fal fa-money-check-edit',
    'fal fa-money-check-edit-alt',
    'fal fa-monitor-heart-rate',
    'fal fa-monkey',
    'fal fa-monument',
    'fal fa-moon',
    'fal fa-moon-cloud',
    'fal fa-moon-stars',
    'fal fa-mortar-pestle',
    'fal fa-mosque',
    'fal fa-motorcycle',
    'fal fa-mountain',
    'fal fa-mountains',
    'fal fa-mouse',
    'fal fa-mouse-alt',
    'fal fa-mouse-pointer',
    'fal fa-mp3-player',
    'fal fa-mug',
    'fal fa-mug-hot',
    'fal fa-mug-marshmallows',
    'fal fa-mug-tea',
    'fal fa-music',
    'fal fa-music-alt',
    'fal fa-music-alt-slash',
    'fal fa-music-slash',
    'fal fa-narwhal',
    'fal fa-network-wired',
    'fal fa-neuter',
    'fal fa-newspaper',
    'fal fa-not-equal',
    'fal fa-notes-medical',
    'fal fa-object-group',
    'fal fa-object-ungroup',
    'fal fa-octagon',
    'fal fa-oil-can',
    'fal fa-oil-temp',
    'fal fa-om',
    'fal fa-omega',
    'fal fa-ornament',
    'fal fa-otter',
    'fal fa-outdent',
    'fal fa-outlet',
    'fal fa-oven',
    'fal fa-overline',
    'fal fa-page-break',
    'fal fa-pager',
    'fal fa-paint-brush',
    'fal fa-paint-brush-alt',
    'fal fa-paint-roller',
    'fal fa-palette',
    'fal fa-pallet',
    'fal fa-pallet-alt',
    'fal fa-paper-plane',
    'fal fa-paperclip',
    'fal fa-parachute-box',
    'fal fa-paragraph',
    'fal fa-paragraph-rtl',
    'fal fa-parking',
    'fal fa-parking-circle',
    'fal fa-parking-circle-slash',
    'fal fa-parking-slash',
    'fal fa-passport',
    'fal fa-pastafarianism',
    'fal fa-paste',
    'fal fa-pause',
    'fal fa-pause-circle',
    'fal fa-paw',
    'fal fa-paw-alt',
    'fal fa-paw-claws',
    'fal fa-peace',
    'fal fa-pegasus',
    'fal fa-pen',
    'fal fa-pen-alt',
    'fal fa-pen-fancy',
    'fal fa-pen-nib',
    'fal fa-pen-square',
    'fal fa-pencil',
    'fal fa-pencil-alt',
    'fal fa-pencil-paintbrush',
    'fal fa-pencil-ruler',
    'fal fa-pennant',
    'fal fa-people-arrows',
    'fal fa-people-carry',
    'fal fa-pepper-hot',
    'fal fa-percent',
    'fal fa-percentage',
    'fal fa-person-booth',
    'fal fa-person-carry',
    'fal fa-person-dolly',
    'fal fa-person-dolly-empty',
    'fal fa-person-sign',
    'fal fa-phone',
    'fal fa-phone-alt',
    'fal fa-phone-laptop',
    'fal fa-phone-office',
    'fal fa-phone-plus',
    'fal fa-phone-rotary',
    'fal fa-phone-slash',
    'fal fa-phone-square',
    'fal fa-phone-square-alt',
    'fal fa-phone-volume',
    'fal fa-photo-video',
    'fal fa-pi',
    'fal fa-piano',
    'fal fa-piano-keyboard',
    'fal fa-pie',
    'fal fa-pig',
    'fal fa-piggy-bank',
    'fal fa-pills',
    'fal fa-pizza',
    'fal fa-pizza-slice',
    'fal fa-place-of-worship',
    'fal fa-plane',
    'fal fa-plane-alt',
    'fal fa-plane-arrival',
    'fal fa-plane-departure',
    'fal fa-plane-slash',
    'fal fa-planet-moon',
    'fal fa-planet-ringed',
    'fal fa-play',
    'fal fa-play-circle',
    'fal fa-plug',
    'fal fa-plus',
    'fal fa-plus-circle',
    'fal fa-plus-hexagon',
    'fal fa-plus-octagon',
    'fal fa-plus-square',
    'fal fa-podcast',
    'fal fa-podium',
    'fal fa-podium-star',
    'fal fa-police-box',
    'fal fa-poll',
    'fal fa-poll-h',
    'fal fa-poll-people',
    'fal fa-poo',
    'fal fa-poo-storm',
    'fal fa-poop',
    'fal fa-popcorn',
    'fal fa-portal-enter',
    'fal fa-portal-exit',
    'fal fa-portrait',
    'fal fa-pound-sign',
    'fal fa-power-off',
    'fal fa-pray',
    'fal fa-praying-hands',
    'fal fa-prescription',
    'fal fa-prescription-bottle',
    'fal fa-prescription-bottle-alt',
    'fal fa-presentation',
    'fal fa-print',
    'fal fa-print-search',
    'fal fa-print-slash',
    'fal fa-procedures',
    'fal fa-project-diagram',
    'fal fa-projector',
    'fal fa-pump-medical',
    'fal fa-pump-soap',
    'fal fa-pumpkin',
    'fal fa-puzzle-piece',
    'fal fa-qrcode',
    'fal fa-question',
    'fal fa-question-circle',
    'fal fa-question-square',
    'fal fa-quidditch',
    'fal fa-quote-left',
    'fal fa-quote-right',
    'fal fa-quran',
    'fal fa-rabbit',
    'fal fa-rabbit-fast',
    'fal fa-racquet',
    'fal fa-radar',
    'fal fa-radiation',
    'fal fa-radiation-alt',
    'fal fa-radio',
    'fal fa-radio-alt',
    'fal fa-rainbow',
    'fal fa-raindrops',
    'fal fa-ram',
    'fal fa-ramp-loading',
    'fal fa-random',
    'fal fa-raygun',
    'fal fa-receipt',
    'fal fa-record-vinyl',
    'fal fa-rectangle-landscape',
    'fal fa-rectangle-portrait',
    'fal fa-rectangle-wide',
    'fal fa-recycle',
    'fal fa-redo',
    'fal fa-redo-alt',
    'fal fa-refrigerator',
    'fal fa-registered',
    'fal fa-remove-format',
    'fal fa-repeat',
    'fal fa-repeat-1',
    'fal fa-repeat-1-alt',
    'fal fa-repeat-alt',
    'fal fa-reply',
    'fal fa-reply-all',
    'fal fa-republican',
    'fal fa-restroom',
    'fal fa-retweet',
    'fal fa-retweet-alt',
    'fal fa-ribbon',
    'fal fa-ring',
    'fal fa-rings-wedding',
    'fal fa-road',
    'fal fa-robot',
    'fal fa-rocket',
    'fal fa-rocket-launch',
    'fal fa-route',
    'fal fa-route-highway',
    'fal fa-route-interstate',
    'fal fa-router',
    'fal fa-rss',
    'fal fa-rss-square',
    'fal fa-ruble-sign',
    'fal fa-ruler',
    'fal fa-ruler-combined',
    'fal fa-ruler-horizontal',
    'fal fa-ruler-triangle',
    'fal fa-ruler-vertical',
    'fal fa-running',
    'fal fa-rupee-sign',
    'fal fa-rv',
    'fal fa-sack',
    'fal fa-sack-dollar',
    'fal fa-sad-cry',
    'fal fa-sad-tear',
    'fal fa-salad',
    'fal fa-sandwich',
    'fal fa-satellite',
    'fal fa-satellite-dish',
    'fal fa-sausage',
    'fal fa-save',
    'fal fa-sax-hot',
    'fal fa-saxophone',
    'fal fa-scalpel',
    'fal fa-scalpel-path',
    'fal fa-scanner',
    'fal fa-scanner-image',
    'fal fa-scanner-keyboard',
    'fal fa-scanner-touchscreen',
    'fal fa-scarecrow',
    'fal fa-scarf',
    'fal fa-school',
    'fal fa-screwdriver',
    'fal fa-scroll',
    'fal fa-scroll-old',
    'fal fa-scrubber',
    'fal fa-scythe',
    'fal fa-sd-card',
    'fal fa-search',
    'fal fa-search-dollar',
    'fal fa-search-location',
    'fal fa-search-minus',
    'fal fa-search-plus',
    'fal fa-seedling',
    'fal fa-send-back',
    'fal fa-send-backward',
    'fal fa-sensor',
    'fal fa-sensor-alert',
    'fal fa-sensor-fire',
    'fal fa-sensor-on',
    'fal fa-sensor-smoke',
    'fal fa-server',
    'fal fa-shapes',
    'fal fa-share',
    'fal fa-share-all',
    'fal fa-share-alt',
    'fal fa-share-alt-square',
    'fal fa-share-square',
    'fal fa-sheep',
    'fal fa-shekel-sign',
    'fal fa-shield',
    'fal fa-shield-alt',
    'fal fa-shield-check',
    'fal fa-shield-cross',
    'fal fa-shield-virus',
    'fal fa-ship',
    'fal fa-shipping-fast',
    'fal fa-shipping-timed',
    'fal fa-shish-kebab',
    'fal fa-shoe-prints',
    'fal fa-shopping-bag',
    'fal fa-shopping-basket',
    'fal fa-shopping-cart',
    'fal fa-shovel',
    'fal fa-shovel-snow',
    'fal fa-shower',
    'fal fa-shredder',
    'fal fa-shuttle-van',
    'fal fa-shuttlecock',
    'fal fa-sickle',
    'fal fa-sigma',
    'fal fa-sign',
    'fal fa-sign-in',
    'fal fa-sign-in-alt',
    'fal fa-sign-language',
    'fal fa-sign-out',
    'fal fa-sign-out-alt',
    'fal fa-signal',
    'fal fa-signal-1',
    'fal fa-signal-2',
    'fal fa-signal-3',
    'fal fa-signal-4',
    'fal fa-signal-alt',
    'fal fa-signal-alt-1',
    'fal fa-signal-alt-2',
    'fal fa-signal-alt-3',
    'fal fa-signal-alt-slash',
    'fal fa-signal-slash',
    'fal fa-signal-stream',
    'fal fa-signature',
    'fal fa-sim-card',
    'fal fa-sink',
    'fal fa-siren',
    'fal fa-siren-on',
    'fal fa-sitemap',
    'fal fa-skating',
    'fal fa-skeleton',
    'fal fa-ski-jump',
    'fal fa-ski-lift',
    'fal fa-skiing',
    'fal fa-skiing-nordic',
    'fal fa-skull',
    'fal fa-skull-cow',
    'fal fa-skull-crossbones',
    'fal fa-slash',
    'fal fa-sledding',
    'fal fa-sleigh',
    'fal fa-sliders-h',
    'fal fa-sliders-h-square',
    'fal fa-sliders-v',
    'fal fa-sliders-v-square',
    'fal fa-smile',
    'fal fa-smile-beam',
    'fal fa-smile-plus',
    'fal fa-smile-wink',
    'fal fa-smog',
    'fal fa-smoke',
    'fal fa-smoking',
    'fal fa-smoking-ban',
    'fal fa-sms',
    'fal fa-snake',
    'fal fa-snooze',
    'fal fa-snow-blowing',
    'fal fa-snowboarding',
    'fal fa-snowflake',
    'fal fa-snowflakes',
    'fal fa-snowman',
    'fal fa-snowmobile',
    'fal fa-snowplow',
    'fal fa-soap',
    'fal fa-socks',
    'fal fa-solar-panel',
    'fal fa-solar-system',
    'fal fa-sort',
    'fal fa-sort-alpha-down',
    'fal fa-sort-alpha-down-alt',
    'fal fa-sort-alpha-up',
    'fal fa-sort-alpha-up-alt',
    'fal fa-sort-alt',
    'fal fa-sort-amount-down',
    'fal fa-sort-amount-down-alt',
    'fal fa-sort-amount-up',
    'fal fa-sort-amount-up-alt',
    'fal fa-sort-circle',
    'fal fa-sort-circle-down',
    'fal fa-sort-circle-up',
    'fal fa-sort-down',
    'fal fa-sort-numeric-down',
    'fal fa-sort-numeric-down-alt',
    'fal fa-sort-numeric-up',
    'fal fa-sort-numeric-up-alt',
    'fal fa-sort-shapes-down',
    'fal fa-sort-shapes-down-alt',
    'fal fa-sort-shapes-up',
    'fal fa-sort-shapes-up-alt',
    'fal fa-sort-size-down',
    'fal fa-sort-size-down-alt',
    'fal fa-sort-size-up',
    'fal fa-sort-size-up-alt',
    'fal fa-sort-up',
    'fal fa-soup',
    'fal fa-spa',
    'fal fa-space-shuttle',
    'fal fa-space-station-moon',
    'fal fa-space-station-moon-alt',
    'fal fa-spade',
    'fal fa-sparkles',
    'fal fa-speaker',
    'fal fa-speakers',
    'fal fa-spell-check',
    'fal fa-spider',
    'fal fa-spider-black-widow',
    'fal fa-spider-web',
    'fal fa-spinner',
    'fal fa-spinner-third',
    'fal fa-splotch',
    'fal fa-spray-can',
    'fal fa-sprinkler',
    'fal fa-square',
    'fal fa-square-full',
    'fal fa-square-root',
    'fal fa-square-root-alt',
    'fal fa-squirrel',
    'fal fa-staff',
    'fal fa-stamp',
    'fal fa-star',
    'fal fa-star-and-crescent',
    'fal fa-star-christmas',
    'fal fa-star-exclamation',
    'fal fa-star-half',
    'fal fa-star-half-alt',
    'fal fa-star-of-david',
    'fal fa-star-of-life',
    'fal fa-star-shooting',
    'fal fa-starfighter',
    'fal fa-starfighter-alt',
    'fal fa-stars',
    'fal fa-starship',
    'fal fa-starship-freighter',
    'fal fa-steak',
    'fal fa-steering-wheel',
    'fal fa-step-backward',
    'fal fa-step-forward',
    'fal fa-stethoscope',
    'fal fa-sticky-note',
    'fal fa-stocking',
    'fal fa-stomach',
    'fal fa-stop',
    'fal fa-stop-circle',
    'fal fa-stopwatch',
    'fal fa-stopwatch-20',
    'fal fa-store',
    'fal fa-store-alt',
    'fal fa-store-alt-slash',
    'fal fa-store-slash',
    'fal fa-stream',
    'fal fa-street-view',
    'fal fa-stretcher',
    'fal fa-strikethrough',
    'fal fa-stroopwafel',
    'fal fa-subscript',
    'fal fa-subway',
    'fal fa-suitcase',
    'fal fa-suitcase-rolling',
    'fal fa-sun',
    'fal fa-sun-cloud',
    'fal fa-sun-dust',
    'fal fa-sun-haze',
    'fal fa-sunglasses',
    'fal fa-sunrise',
    'fal fa-sunset',
    'fal fa-superscript',
    'fal fa-surprise',
    'fal fa-swatchbook',
    'fal fa-swimmer',
    'fal fa-swimming-pool',
    'fal fa-sword',
    'fal fa-sword-laser',
    'fal fa-sword-laser-alt',
    'fal fa-swords',
    'fal fa-swords-laser',
    'fal fa-synagogue',
    'fal fa-sync',
    'fal fa-sync-alt',
    'fal fa-syringe',
    'fal fa-table',
    'fal fa-table-tennis',
    'fal fa-tablet',
    'fal fa-tablet-alt',
    'fal fa-tablet-android',
    'fal fa-tablet-android-alt',
    'fal fa-tablet-rugged',
    'fal fa-tablets',
    'fal fa-tachometer',
    'fal fa-tachometer-alt',
    'fal fa-tachometer-alt-average',
    'fal fa-tachometer-alt-fast',
    'fal fa-tachometer-alt-fastest',
    'fal fa-tachometer-alt-slow',
    'fal fa-tachometer-alt-slowest',
    'fal fa-tachometer-average',
    'fal fa-tachometer-fast',
    'fal fa-tachometer-fastest',
    'fal fa-tachometer-slow',
    'fal fa-tachometer-slowest',
    'fal fa-taco',
    'fal fa-tag',
    'fal fa-tags',
    'fal fa-tally',
    'fal fa-tanakh',
    'fal fa-tape',
    'fal fa-tasks',
    'fal fa-tasks-alt',
    'fal fa-taxi',
    'fal fa-teeth',
    'fal fa-teeth-open',
    'fal fa-telescope',
    'fal fa-temperature-down',
    'fal fa-temperature-frigid',
    'fal fa-temperature-high',
    'fal fa-temperature-hot',
    'fal fa-temperature-low',
    'fal fa-temperature-up',
    'fal fa-tenge',
    'fal fa-tennis-ball',
    'fal fa-terminal',
    'fal fa-text',
    'fal fa-text-height',
    'fal fa-text-size',
    'fal fa-text-width',
    'fal fa-th',
    'fal fa-th-large',
    'fal fa-th-list',
    'fal fa-theater-masks',
    'fal fa-thermometer',
    'fal fa-thermometer-empty',
    'fal fa-thermometer-full',
    'fal fa-thermometer-half',
    'fal fa-thermometer-quarter',
    'fal fa-thermometer-three-quarters',
    'fal fa-theta',
    'fal fa-thumbs-down',
    'fal fa-thumbs-up',
    'fal fa-thumbtack',
    'fal fa-thunderstorm',
    'fal fa-thunderstorm-moon',
    'fal fa-thunderstorm-sun',
    'fal fa-ticket',
    'fal fa-ticket-alt',
    'fal fa-tilde',
    'fal fa-times',
    'fal fa-times-circle',
    'fal fa-times-hexagon',
    'fal fa-times-octagon',
    'fal fa-times-square',
    'fal fa-tint',
    'fal fa-tint-slash',
    'fal fa-tire',
    'fal fa-tire-flat',
    'fal fa-tire-pressure-warning',
    'fal fa-tire-rugged',
    'fal fa-tired',
    'fal fa-toggle-off',
    'fal fa-toggle-on',
    'fal fa-toilet',
    'fal fa-toilet-paper',
    'fal fa-toilet-paper-alt',
    'fal fa-toilet-paper-slash',
    'fal fa-tombstone',
    'fal fa-tombstone-alt',
    'fal fa-toolbox',
    'fal fa-tools',
    'fal fa-tooth',
    'fal fa-toothbrush',
    'fal fa-torah',
    'fal fa-torii-gate',
    'fal fa-tornado',
    'fal fa-tractor',
    'fal fa-trademark',
    'fal fa-traffic-cone',
    'fal fa-traffic-light',
    'fal fa-traffic-light-go',
    'fal fa-traffic-light-slow',
    'fal fa-traffic-light-stop',
    'fal fa-trailer',
    'fal fa-train',
    'fal fa-tram',
    'fal fa-transgender',
    'fal fa-transgender-alt',
    'fal fa-transporter',
    'fal fa-transporter-1',
    'fal fa-transporter-2',
    'fal fa-transporter-3',
    'fal fa-transporter-empty',
    'fal fa-trash',
    'fal fa-trash-alt',
    'fal fa-trash-restore',
    'fal fa-trash-restore-alt',
    'fal fa-trash-undo',
    'fal fa-trash-undo-alt',
    'fal fa-treasure-chest',
    'fal fa-tree',
    'fal fa-tree-alt',
    'fal fa-tree-christmas',
    'fal fa-tree-decorated',
    'fal fa-tree-large',
    'fal fa-tree-palm',
    'fal fa-trees',
    'fal fa-triangle',
    'fal fa-triangle-music',
    'fal fa-trophy',
    'fal fa-trophy-alt',
    'fal fa-truck',
    'fal fa-truck-container',
    'fal fa-truck-couch',
    'fal fa-truck-loading',
    'fal fa-truck-monster',
    'fal fa-truck-moving',
    'fal fa-truck-pickup',
    'fal fa-truck-plow',
    'fal fa-truck-ramp',
    'fal fa-trumpet',
    'fal fa-tshirt',
    'fal fa-tty',
    'fal fa-turkey',
    'fal fa-turntable',
    'fal fa-turtle',
    'fal fa-tv',
    'fal fa-tv-alt',
    'fal fa-tv-music',
    'fal fa-tv-retro',
    'fal fa-typewriter',
    'fal fa-ufo',
    'fal fa-ufo-beam',
    'fal fa-umbrella',
    'fal fa-umbrella-beach',
    'fal fa-underline',
    'fal fa-undo',
    'fal fa-undo-alt',
    'fal fa-unicorn',
    'fal fa-union',
    'fal fa-universal-access',
    'fal fa-university',
    'fal fa-unlink',
    'fal fa-unlock',
    'fal fa-unlock-alt',
    'fal fa-upload',
    'fal fa-usb-drive',
    'fal fa-usd-circle',
    'fal fa-usd-square',
    'fal fa-user',
    'fal fa-user-alien',
    'fal fa-user-alt',
    'fal fa-user-alt-slash',
    'fal fa-user-astronaut',
    'fal fa-user-chart',
    'fal fa-user-check',
    'fal fa-user-circle',
    'fal fa-user-clock',
    'fal fa-user-cog',
    'fal fa-user-cowboy',
    'fal fa-user-crown',
    'fal fa-user-edit',
    'fal fa-user-friends',
    'fal fa-user-graduate',
    'fal fa-user-hard-hat',
    'fal fa-user-headset',
    'fal fa-user-injured',
    'fal fa-user-lock',
    'fal fa-user-md',
    'fal fa-user-md-chat',
    'fal fa-user-minus',
    'fal fa-user-music',
    'fal fa-user-ninja',
    'fal fa-user-nurse',
    'fal fa-user-plus',
    'fal fa-user-robot',
    'fal fa-user-secret',
    'fal fa-user-shield',
    'fal fa-user-slash',
    'fal fa-user-tag',
    'fal fa-user-tie',
    'fal fa-user-times',
    'fal fa-user-unlock',
    'fal fa-user-visor',
    'fal fa-users',
    'fal fa-users-class',
    'fal fa-users-cog',
    'fal fa-users-crown',
    'fal fa-users-medical',
    'fal fa-users-slash',
    'fal fa-utensil-fork',
    'fal fa-utensil-knife',
    'fal fa-utensil-spoon',
    'fal fa-utensils',
    'fal fa-utensils-alt',
    'fal fa-vacuum',
    'fal fa-vacuum-robot',
    'fal fa-value-absolute',
    'fal fa-vector-square',
    'fal fa-venus',
    'fal fa-venus-double',
    'fal fa-venus-mars',
    'fal fa-vest',
    'fal fa-vest-patches',
    'fal fa-vhs',
    'fal fa-vial',
    'fal fa-vials',
    'fal fa-video',
    'fal fa-video-plus',
    'fal fa-video-slash',
    'fal fa-vihara',
    'fal fa-violin',
    'fal fa-virus',
    'fal fa-virus-slash',
    'fal fa-viruses',
    'fal fa-voicemail',
    'fal fa-volcano',
    'fal fa-volleyball-ball',
    'fal fa-volume',
    'fal fa-volume-down',
    'fal fa-volume-mute',
    'fal fa-volume-off',
    'fal fa-volume-slash',
    'fal fa-volume-up',
    'fal fa-vote-nay',
    'fal fa-vote-yea',
    'fal fa-vr-cardboard',
    'fal fa-wagon-covered',
    'fal fa-walker',
    'fal fa-walkie-talkie',
    'fal fa-walking',
    'fal fa-wallet',
    'fal fa-wand',
    'fal fa-wand-magic',
    'fal fa-warehouse',
    'fal fa-warehouse-alt',
    'fal fa-washer',
    'fal fa-watch',
    'fal fa-watch-calculator',
    'fal fa-watch-fitness',
    'fal fa-water',
    'fal fa-water-lower',
    'fal fa-water-rise',
    'fal fa-wave-sine',
    'fal fa-wave-square',
    'fal fa-wave-triangle',
    'fal fa-waveform',
    'fal fa-waveform-path',
    'fal fa-webcam',
    'fal fa-webcam-slash',
    'fal fa-weight',
    'fal fa-weight-hanging',
    'fal fa-whale',
    'fal fa-wheat',
    'fal fa-wheelchair',
    'fal fa-whistle',
    'fal fa-wifi',
    'fal fa-wifi-1',
    'fal fa-wifi-2',
    'fal fa-wifi-slash',
    'fal fa-wind',
    'fal fa-wind-turbine',
    'fal fa-wind-warning',
    'fal fa-window',
    'fal fa-window-alt',
    'fal fa-window-close',
    'fal fa-window-frame',
    'fal fa-window-frame-open',
    'fal fa-window-maximize',
    'fal fa-window-minimize',
    'fal fa-window-restore',
    'fal fa-windsock',
    'fal fa-wine-bottle',
    'fal fa-wine-glass',
    'fal fa-wine-glass-alt',
    'fal fa-won-sign',
    'fal fa-wreath',
    'fal fa-wrench',
    'fal fa-x-ray',
    'fal fa-yen-sign',
    'fal fa-yin-yang'
];

$(document).ready(function () {


    $(".pix-picker").each(function () {
        div = $(this);
        if (faIcons) {
            var iconos = "<ul>";
            for (var i = 0; i < faIcons.length; i++) { iconos += '<li><i data-valor="' + faIcons[i] + '" rel="' + faIcons[i] + '" class="' + faIcons[i] + '"></i></li>'; }
            iconos += "</ul>";
        }

        div.append("<div class='divPickerIconos'><input class='txtBuscadorIconos' type='text' placeholder='Buscar...'>" + iconos + "</div>");
        div.find('input').addClass('inputpicker');
    });
    $(".inputpicker").click(function (e) {

        $(this).parent().find(".divPickerIconos").fadeIn("fast");
        $(this).parent().find(".divPickerIconos").find(".txtBuscadorIconos").focus();
        e.stopPropagation();
    });
    $(".divPickerIconos ul li").click(function () {
        var campo = $(this).parent().parent().parent();
        campo.find(".inputpicker").val($(this).find("i").data("valor"));
        campo.find(".divPickerIconos").fadeToggle("fast");
        campo.parent().parent().parent().parent().find(".titulo").find("i").attr("class", "fas " + $(this).find("i").data("valor"));
        campo.addClass('pix-relleno');
    });
    $(".txtBuscadorIconos").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
    });

    $(".txtBuscadorIconos").keyup(function (e) {
        e.stopPropagation();
        var value = $(this).val();
        $(this).parent().find("ul li i").each(function () {
            if ($(this).attr("rel").search(value) > -1) $(this).closest("li").show();
            else $(this).closest("li").hide();
        });
    });

});

$("body").click(function () {
    $(".divPickerIconos").removeAttr("style");
});
/*fin fontawesome picker*/


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    document.cookie = cname + "=" + cvalue + ";expires=" + d.toUTCString() + ";path=/;SameSite=Lax;secure";
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}