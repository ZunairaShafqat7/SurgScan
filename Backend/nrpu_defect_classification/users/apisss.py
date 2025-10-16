@csrf_exempt
def api_inspect_image(request):
    if request.method == 'POST':
        batch = request.POST.get('batch')
        user_id = request.POST.get('id')
        
        # Get the image file from the request
        image = request.FILES.get('image')
        
        # Open the image with Pillow
        try:
            # default_storage.save('images/raw.jpg', ContentFile(image.read()))
            image = Image.open(image)
        except Exception as e:
            return JsonResponse({'error': f'Failed to open image: {str(e)}'}, status=500)

        if not image or not batch or not user_id:
            return JsonResponse({'error': 'Missing perimeters'}, status=400)

        # Validate the batch and user information
        try:
            batch_detail = BatchDetail.objects.get(batch_number=batch, user_id=user_id)
        except BatchDetail.DoesNotExist:
            return JsonResponse({'error': 'Batch not found(userId or batchNo incorrect)'}, status=404)
        # image = image.convert('RGBA')
        try:
            # image = Image.open(image)
            
            # If the image is in 'RGBA' mode (which has an alpha channel), convert it to 'RGB'
            if image.mode == 'RGBA':
                image = image.convert('RGB')
                # return JsonResponse({"message":"RGBA converted to RGB"})
                # image_io = BytesIO()
                # image.save(image_io, format='JPEG')  # Save as JPEG in the BytesIO object

                # # Use default_storage to save the file
                # default_storage.save('images/raw.jpg', ContentFile(image_io.getvalue()))

        except Exception as e:
            return JsonResponse({'error': f'Failed to open image: {str(e)}'}, status=500)
        # image = None
        try:
            # image = np.array(image)
            cropped_image=None
            image = np.array(image)
            # cropped_image = extract_cropped(image)
            # cropped_image =None
            print("Starting Unsharp Masking")
            if cropped_image is not None:
                image = unsharp_mask(cropped_image)
                # cv2.imwrite("check.jpg",image)
            else:
                image = unsharp_mask(image)
                # return JsonResponse({"message":"Preprocessing/Unsharp Masking Successfull"})
                # image = resize_with_aspect_ratio(image,(1024,1024),[0,0,0])

        except Exception as e:
            return JsonResponse({'error': f'Preprocessing/Unsharp masking failed: {str(e)}'}, status=500)
        
        # image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # Convert from BGR to RGB
        # image = Image.fromarray(image_rgb)
        # Convert the image to a file-like object (BytesIO)
        image_bytes = io.BytesIO()
        image.save(image_bytes, format='JPEG')  # Save as PNG or any other format you prefer
        image_bytes.seek(0)  # Reset pointer to the beginning of the file
        
        # Create a file name for the image
        image_name = f"{batch}_{user_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
        print(image_name)
        # Save the image as a ContentFile
        image_file = ContentFile(image_bytes.read(), name=image_name)
        # print(image_file)

        # Save the image to the BatchImage model
        # batch_image = BatchImage.objects.create(batch_detail=batch_detail, image=image_file)
        # batch_image.save()
        # BatchImage.objects.all().delete()



        try:
            image = np.array(image)
            prediction = instruments(image)
            # Extract the class label and confidence score from the prediction
            predicted_class = prediction[0].names[prediction[0].probs.top1]  # Get the predicted class
            confidence = prediction[0].probs.top1conf.item()  # Get the confidence score
            print(">>",predicted_class,type(predicted_class))
            print(">",confidence,type(confidence))
            # if(predicted_class == "Bandage Scissor"):
            #     image = extract_cropped(image)
            if confidence < 0.80:
                instrument = "NO Instrument Detected"
                defect = "Unidentified"
                # confidence = None
                # print("Breached",confidence)
            else:
                batch_detail = BatchDetail.objects.get(batch_number=batch)
                instrument = predicted_class
                try:
                    # image = np.array(image)
                    print(DEFECT_MODELS_PATHS[predicted_class])
                    model_defect = YOLO(DEFECT_MODELS_PATHS[predicted_class])
                    prediction = model_defect(image)
                    # print(">>>",prediction,"\n")
                    # Extract the class label and confidence score from the prediction
                    predicted_class = prediction[0].names[prediction[0].probs.top1]  # Get the predicted class
                    confidence = prediction[0].probs.top1conf.item()  # Get the confidence score
                    print(">>",predicted_class,type(predicted_class))
                    print(">",confidence)
                    defect = predicted_class

                    batch_detail.total_images_inspected += 1
                    if defect == "Undefected":
                        batch_detail.total_non_defected_images += 1
                    else:
                        batch_detail.total_defected_images += 1
                except Exception as e:
                    return JsonResponse({'error': f'YOLOv8 defect prediction failed: {str(e)}'}, status=500)


                batch_image = BatchImage.objects.create(batch_detail=batch_detail, image=image_file)
                batch_image.save()
                batch_detail.save()
                # BatchImage.objects.all().delete()
                # BatchDetail.objects.all().delete()

        except Exception as e:
            return JsonResponse({'error': f'YOLOv8 instrument prediction failed: {str(e)}'}, status=500)
        


        # Respond with success and include the URL to access the image
        date = datetime.now().strftime('%Y-%m-%d')
        time = datetime.now().strftime('%H:%M:%S')
        # print(time, date)
        return JsonResponse({
            'message': 'Image uploaded successfully',
            # 'file_path': batch_image.image.url,  # Accessible URL of the image
            'defect': defect,
            'confidence': confidence,
            'instrument': instrument,
            'time': time,
            'date': date
        }, status=200)

    return JsonResponse({'error': 'Invalid request method:' + str(request.method)}, status=400)