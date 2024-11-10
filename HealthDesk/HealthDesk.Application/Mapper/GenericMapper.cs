using System.Collections;
using System.Reflection;

namespace HealthDesk.Application;

public static class GenericMapper
    {
        public static void Map<TSource, TDestination>(TSource source, TDestination destination)
        {
            var sourceProperties = typeof(TSource).GetProperties(BindingFlags.Public | BindingFlags.Instance);
            var destinationProperties = typeof(TDestination).GetProperties(BindingFlags.Public | BindingFlags.Instance);

            foreach (var sourceProperty in sourceProperties)
            {
                var destinationProperty = destinationProperties.FirstOrDefault(prop => prop.Name == sourceProperty.Name 
                                                                                       && prop.PropertyType == sourceProperty.PropertyType);
                
                if (destinationProperty != null && destinationProperty.CanWrite)
                {
                    var sourceValue = sourceProperty.GetValue(source);
                    if (sourceValue == null) continue;

                    // Check if the property is a list
                    if (IsList(sourceProperty.PropertyType))
                    {
                        var sourceList = (IEnumerable)sourceValue;
                        var destinationList = (IList)Activator.CreateInstance(destinationProperty.PropertyType);

                        foreach (var item in sourceList)
                        {
                            // If the list is of a complex type, recursively map each item
                            if (IsComplexType(item.GetType()))
                            {
                                var destinationItem = Activator.CreateInstance(destinationProperty.PropertyType.GenericTypeArguments[0]);
                                Map(item, destinationItem);
                                destinationList.Add(destinationItem);
                            }
                            else
                            {
                                // For primitive types, add directly
                                destinationList.Add(item);
                            }
                        }

                        destinationProperty.SetValue(destination, destinationList);
                    }
                    else if (IsComplexType(sourceProperty.PropertyType))
                    {
                        // Handle complex nested objects by recursive mapping
                        var destinationValue = Activator.CreateInstance(destinationProperty.PropertyType);
                        Map(sourceValue, destinationValue);
                        destinationProperty.SetValue(destination, destinationValue);
                    }
                    else
                    {
                        // For simple types, map directly
                        destinationProperty.SetValue(destination, sourceValue);
                    }
                }
            }
        }

        // Helper method to check if a type is a list
        private static bool IsList(Type type)
        {
            return type.IsGenericType && typeof(IEnumerable).IsAssignableFrom(type);
        }

        // Helper method to check if a type is a complex (non-primitive) type
        private static bool IsComplexType(Type type)
        {
            return type.IsClass && type != typeof(string);
        }
    }
